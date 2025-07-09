from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django import forms
from django.contrib.auth import get_user_model
from .models import Permission, Comment, CommentHistory

User = get_user_model()

# Custom forms for User model to handle email as username field

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('email', 'username')  # fields shown during user creation

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ('email', 'username', 'is_super_admin', 'is_staff', 'is_active')

class UserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User

    list_display = ('email', 'username', 'is_super_admin', 'is_staff', 'is_active')
    list_filter = ('is_super_admin', 'is_staff', 'is_active')

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Permissions', {'fields': ('is_super_admin', 'is_staff', 'is_active', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_super_admin', 'is_staff', 'is_active'),
        }),
    )
    search_fields = ('email', 'username')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)

# Register User with the customized admin
admin.site.register(User, UserAdmin)

# Register other models as you already have them

@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ("user", "page", "action")
    list_filter = ("page", "action")
    search_fields = ("user__email",)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "page", "created_by", "text", "modified_at")
    list_filter = ("page", "modified_at")
    search_fields = ("text", "created_by__email")

@admin.register(CommentHistory)
class CommentHistoryAdmin(admin.ModelAdmin):
    list_display = ("comment", "modified_by", "text", "timestamp")
    list_filter = ("timestamp",)
    search_fields = ("text", "modified_by__email", "comment__text")
