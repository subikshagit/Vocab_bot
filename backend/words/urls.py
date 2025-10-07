from django import views
from django.urls import path
from .views import quiz_attempt_detail, recent_quizzes,save_quiz_attempt,average_accuracy, streak_count,get_profile, learning_list_count, register_user, login_view,search_word,random_word,add_to_learning_list,view_learning_list ,quiz_questions,review_words,submit_quiz,ai_definition

from rest_framework_simplejwt.views import (
    TokenObtainPairView,   # for login (get access + refresh)
    TokenRefreshView       # for refreshing access token
)

urlpatterns = [
    path("auth/register", register_user, name="register"),
    path("auth/login", login_view, name="login"),
    path("auth/profile/", get_profile, name="profile"),
    path("words/search/", search_word, name="search_word"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('words/random', random_word, name='random_word'),
    path("learning-list/", add_to_learning_list, name="add_to_learning_list"),
    path("learning-list/view/", view_learning_list, name="view_learning_list"),
    path("quiz-questions/", quiz_questions, name="quiz_questions"),
    path("review-words/", review_words, name="review_words"),
    path("learning-list/count/", learning_list_count, name="learning_list_count"),
    path("save-quiz-attempt/", save_quiz_attempt, name="save-quiz-attempt"),
    path("quiz/streak/", streak_count, name="streak_count"),
    path("quiz/average-accuracy/", average_accuracy, name="average_accuracy"),
    path("quiz/recent/", recent_quizzes, name="recent_quizzes"),
    path("quiz-attempts/<int:attempt_id>/", quiz_attempt_detail, name="quiz_attempt_detail"),
    path("quiz/submit/", submit_quiz, name="submit_quiz"),
    path("ai-definition/", ai_definition, name="ai_definition"),
]
