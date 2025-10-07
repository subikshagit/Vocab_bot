from rest_framework import serializers
from .models import Word, UserWord,User,LearningList,QuizAttempt, AttemptedQuestion

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = '__all__'


class UserWordSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWord
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
    

class LearningListSerializer(serializers.ModelSerializer):
    word = WordSerializer()  # <-- nested word details

    class Meta:
        model = LearningList
        fields = ["id", "word"]  

class AttemptedQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttemptedQuestion
        fields = ["id", "question_text", "selected_answer", "correct_answer", "is_correct"]

class QuizAttemptSerializer(serializers.ModelSerializer):
    questions = AttemptedQuestionSerializer(many=True, read_only=True)  # <- important!

    class Meta:
        model = QuizAttempt
        fields = ["id", "score", "total_questions", "created_at", "questions"]