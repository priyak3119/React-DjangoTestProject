from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    is_super_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    email = models.EmailField(unique=True)


PAGES = [
    ('products', 'Products List'),
    ('marketing', 'Marketing List'),
    ('orders', 'Order List'),
    ('media', 'Media Plans'),
    ('pricing', 'Offer Pricing SKUs'),
    ('clients', 'Clients'),
    ('suppliers', 'Suppliers'),
    ('support', 'Customer Support'),
    ('sales', 'Sales Reports'),
    ('finance', 'Finance & Accounting'),
]

ACTIONS = [('view', 'View'), ('edit', 'Edit'), ('create', 'Create'), ('delete', 'Delete')]

class Permission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    page = models.CharField(choices=PAGES, max_length=100)
    action = models.CharField(choices=ACTIONS, max_length=20)

class Comment(models.Model):
    page = models.CharField(choices=PAGES, max_length=100)
    text = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    modified_at = models.DateTimeField(auto_now=True)

class CommentHistory(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='history')
    modified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
class Permission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    page = models.CharField(max_length=100)
    action = models.CharField(max_length=10, choices=[('view', 'view'), ('create', 'create'), ('edit', 'edit'), ('delete', 'delete')])
    
    
    
