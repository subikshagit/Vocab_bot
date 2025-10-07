from django.shortcuts import get_object_or_404
from .models import AttemptedQuestion, Word, LearningList, QuizAttempt
from .serializer import QuizAttemptSerializer, WordSerializer, LearningListSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import random
from datetime import date, timedelta
import hashlib  
from .vocab_bot import get_ai_definition
User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }



@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get("name")
    password = request.data.get("password")
    email = request.data.get("email")

    if not username or not password:
        return Response({"error": "Username and password are required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    user = User.objects.create_user(username=username, password=password, email=email)
    tokens = get_tokens_for_user(user)

    return Response({
        "message": "User registered successfully",
        "tokens": tokens
    })

@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)

    try:
        # Find user by email
        user_obj = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=400)

    # Authenticate using username (since Django uses username internally)
    user = authenticate(username=user_obj.username, password=password)
    if not user:
        return Response({"error": "Invalid credentials"}, status=400)

    # Generate JWT tokens
    tokens = get_tokens_for_user(user)

    return Response({
        "message": "Login successful",
        "tokens": tokens
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_word(request):
    q = request.query_params.get("q")
    print("DEBUG: Search API hit with query =", q)

    if not q:
        return Response({"found": False, "error": "No search query provided"}, status=400)

    try:
        word = Word.objects.get(text__iexact=q)
        serializer = WordSerializer(word)
        return Response({"found": True, "word": serializer.data}, status=200)
    except Word.DoesNotExist:
        return Response({"found": False, "error": "Word not found in database"}, status=404)

@api_view(["GET"])
def random_word(request): 
    words = Word.objects.all()
    if not words:
        return Response({"error": "No words available"}, status=404)

    # Create a stable seed from today's date
    today = str(date.today())  # e.g. "2025-09-23"
    seed = int(hashlib.md5(today.encode()).hexdigest(), 16)

    # Use that seed to pick a word consistently for the whole day
    word = words[seed % len(words)]
    serializer = WordSerializer(word)
    return Response(serializer.data, status=200)



@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def add_to_learning_list(request):
    print("DEBUG: add_to_learning_list API hit")
    print("DEBUG request.data:", request.data)
    user = request.user
    word_id = request.data.get("word_id")
    
    if not word_id:
        return Response({"error": "word_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        word = Word.objects.get(id=word_id)
    except Word.DoesNotExist:
        return Response({"error": "Word not found"}, status=status.HTTP_404_NOT_FOUND)

    if LearningList.objects.filter(user=user, word=word).exists():
        return Response({"error": "Word already in learning list"}, status=status.HTTP_400_BAD_REQUEST)

    entry = LearningList.objects.create(user=user, word=word)
    serializer = LearningListSerializer(entry)
    return Response(serializer.data, status=status.HTTP_201_CREATED)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def view_learning_list(request):
    try:
        learning_items = LearningList.objects.filter(user=request.user)
        serializer = LearningListSerializer(learning_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def quiz_questions(request):
    words = list(Word.objects.order_by("?")[:5])
    print("DEBUG: Total words available for quiz:", len(words))
    if not words:
        return Response(["No words available for quiz"], status=200)

    questions = []
    for word in words:
        # Correct meaning
        correct_answer = word.meaning

        # Pick 3 random wrong meanings
        wrong_choices = list(
            Word.objects.exclude(id=word.id).values_list("meaning", flat=True)
        )
        wrong_options = random.sample(wrong_choices, min(3, len(wrong_choices)))

        # Combine and shuffle options
        options = wrong_options + [correct_answer]
        random.shuffle(options)

        # Create question object
        questions.append({
            "id": word.id,
            "word": word.text,
            "question": f"What is the meaning of '{word.text}'?",
            "options": options,
            "correctAnswer": options.index(correct_answer),  # position of correct answer
        })
    print(questions)
    return Response(questions)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def review_words(request):
    # Get all words user saved in their learning list
    words = LearningList.objects.filter(user=request.user).select_related("word")
    data = [
        {"id": item.word.id, "text": item.word.text, "meaning": item.word.meaning}
        for item in words
    ]
    return Response(data, status=200)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    return Response({
        "name": user.username,
        "email": user.email,
        "joined_date": user.date_joined,  # Django User model has this
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def learning_list_count(request):
    count = LearningList.objects.filter(user=request.user).count()
    return Response({"count": count})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_quiz_attempt(request):
    print("✅ save_quiz_attempt endpoint hit!")   # debug
    print("Request data:", request.data)   
    user = request.user
    data = request.data  # contains score + questions + answers

    attempt = QuizAttempt.objects.create(
        user=user,
        score=data["score"],
        total_questions=data["total_questions"]
    )

    # save each answered question
    for q in data["questions"]:
        AttemptedQuestion.objects.create(
            quiz_attempt=attempt,
            question_text=q["question_text"],
            selected_answer=q["selected_answer"],
            correct_answer=q["correct_answer"],
            is_correct=q["is_correct"]
        )
    print("Received questions:", data.get("questions"))
    return Response({"message": "Quiz saved!", "attempt_id": attempt.id})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def streak_count(request):
    attempts = QuizAttempt.objects.filter(user=request.user).order_by("-created_at")

    if not attempts.exists():
        return Response({"streak": 0})

    streak = 1
    today = date.today()

    # ✅ take only the date part of created_at
    last_date = attempts[0].created_at.date()

    # If the last attempt wasn’t today → streak is 0
    if last_date != today:
        return Response({"streak": 0})

    # Walk through older attempts
    for attempt in attempts[1:]:
        attempt_date = attempt.created_at.date()  # ✅ use .date() here
        if last_date - attempt_date == timedelta(days=1):
            streak += 1
            last_date = attempt_date
        else:
            break

    return Response({"streak": streak})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def average_accuracy(request):
    user = request.user
    attempts = QuizAttempt.objects.filter(user=user)

    if not attempts.exists():
        return Response({"accuracy": 0})

    total_score = sum(a.score for a in attempts)  # ✅ correct answers
    total_questions = sum(a.total_questions for a in attempts)  # ✅ attempted questions

    accuracy = (total_score / total_questions) * 100 if total_questions > 0 else 0

    return Response({"accuracy": round(accuracy, 2)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recent_quizzes(request):
    user = request.user
    attempts = QuizAttempt.objects.filter(user=user).order_by("-created_at")[:5]

    data = [
        {
            "id": attempt.id,
            "date": attempt.created_at.strftime("%Y-%m-%d"),
            "score": attempt.score,
            "total": attempt.total_questions,
            "accuracy": round((attempt.score / attempt.total_questions) * 100, 2),
        }
        for attempt in attempts
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def quiz_attempt_detail(request, attempt_id):
    attempt = get_object_or_404(QuizAttempt, id=attempt_id, user=request.user)
    serializer = QuizAttemptSerializer(attempt)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_quiz(request):
    user = request.user
    questions_data = request.data.get("questions", [])  # list of answered questions

    if not questions_data:
        return Response({"error": "No questions provided"}, status=400)

    # calculate score
    score = sum(1 for q in questions_data if q["selected_answer"] == q["correct_answer"])
    total = len(questions_data)
    

    # create the attempt
    attempt = QuizAttempt.objects.create(
        user=user,
        score=score,
        total_questions=total
    )

    # save each attempted question
    for q in questions_data:
        AttemptedQuestion.objects.create(
            quiz_attempt=attempt,
            question_text=q.get("question_text", ""),
            selected_answer=q.get("selected_answer", ""),
            correct_answer=q.get("correct_answer", ""),
            is_correct=(q.get("selected_answer") == q.get("correct_answer"))
        )

    return Response({
        "id": attempt.id,
        "score": score,
        "total": total,
        "created_at": attempt.created_at,
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def ai_definition(request):
    word = request.query_params.get("word")
    if not word:
        return Response({"error": "Word parameter is required"}, status=400)
    definition = get_ai_definition(word)
    return Response({"definition": definition})
