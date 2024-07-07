from django.shortcuts import get_object_or_404
from .models import Document
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import DocumentSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class DocumentCreateView(generics.CreateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

class SingleDocumentView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    

class Document_OfSpecificUser(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the documents
        for the currently authenticated user.
        """
        user_id = self.kwargs.get('user_id')  # Assuming 'user_id' is passed via URLconf
        if user_id:
            user = get_object_or_404(User, id=user_id)
            return Document.objects.filter(user=user)
        return Document.objects.none()  # Return an empty queryset if no user_id is provided
