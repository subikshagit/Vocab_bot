from django.contrib import admin
from .models import Word, UserWord

# Register both models
admin.site.register(Word)
admin.site.register(UserWord)
