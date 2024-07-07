from django.db import models
from django.contrib.auth.models import User

class Document(models.Model):
    DocumentStatus = [
        ('draft', 'Draft'),
        ('final', 'Final')
    ]
    
    content = models.TextField()
    status = models.CharField(max_length=5, choices=DocumentStatus)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    
    def __str__(self):
        return f'{self.user.username} - {self.get_status_display()}'
