# backend/core/admin.py
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.contrib.auth.models import Group

User = get_user_model()

admin.site.register(User, UserAdmin)
admin.site.register(Group, GroupAdmin)
