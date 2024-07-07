# law_app/urls.py

from django.urls import path
from .views import DocumentCreateView, SingleDocumentView, Document_OfSpecificUser

urlpatterns = [
    path('documents/', DocumentCreateView.as_view(), name='document-create'),
    path('documents/<int:pk>/', SingleDocumentView.as_view(), name='single-document'),
    path('users/<int:user_id>/documents/', Document_OfSpecificUser.as_view(), name='documents-of-specific-user'),
]
