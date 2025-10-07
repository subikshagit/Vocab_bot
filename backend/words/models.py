from django.db import models
from django.contrib.auth.models import User

# A word in the vocabulary
class Word(models.Model):
    text = models.CharField(max_length=100, unique=True)
    meaning = models.TextField()
    example = models.TextField()
    def __str__(self):
        return self.text


# Words saved by a user
class UserWord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    added_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.word.text}"
    
# Words a user is currently learning 
class LearningList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="learning_list")
    word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name="in_learning_lists")
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "word")  # prevent duplicates

    def __str__(self):
        return f"{self.user.username} → {self.word.text}"
    

class QuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="quiz_attempts")
    score = models.PositiveIntegerField()
    total_questions = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)  # automatically store the timestamp
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - Score: {self.score}/{self.total_questions}"



class AttemptedQuestion(models.Model):
    quiz_attempt = models.ForeignKey(
        QuizAttempt, 
        on_delete=models.CASCADE, 
        related_name="questions"
    )
    question_text = models.TextField()
    selected_answer = models.TextField()
    correct_answer = models.TextField()
    is_correct = models.BooleanField()

    def __str__(self):
        return f"{self.question_text[:50]}..."
