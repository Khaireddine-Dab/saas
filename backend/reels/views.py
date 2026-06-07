from rest_framework import viewsets, permissions
from .models import Reel, Story, ReelComment, StoryView
from .serializers import ReelSerializer, StorySerializer, ReelCommentSerializer, StoryViewSerializer

class ReelViewSet(viewsets.ModelViewSet):
    queryset = Reel.objects.all()
    serializer_class = ReelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        store_id = self.request.query_params.get('store_id')
        if store_id:
            queryset = queryset.filter(store_id=store_id)
        
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
            
        return queryset

class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        store_id = self.request.query_params.get('store_id')
        if store_id:
            queryset = queryset.filter(store_id=store_id)
            
        is_approved = self.request.query_params.get('is_approved')
        if is_approved is not None:
            is_approved = is_approved.lower() == 'true'
            queryset = queryset.filter(is_approved=is_approved)
            
        return queryset

class ReelCommentViewSet(viewsets.ModelViewSet):
    queryset = ReelComment.objects.all()
    serializer_class = ReelCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        reel_id = self.request.query_params.get('reel_id')
        if reel_id:
            queryset = queryset.filter(reel_id=reel_id)
        return queryset

class StoryViewViewSet(viewsets.ModelViewSet):
    queryset = StoryView.objects.all()
    serializer_class = StoryViewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        story_id = self.request.query_params.get('story_id')
        if story_id:
            queryset = queryset.filter(story_id=story_id)
        return queryset
