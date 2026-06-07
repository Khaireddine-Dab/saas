from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReelViewSet, StoryViewSet, ReelCommentViewSet, StoryViewViewSet

router = DefaultRouter()
router.register(r'reels', ReelViewSet, basename='reel')
router.register(r'stories', StoryViewSet, basename='story')
router.register(r'reel-comments', ReelCommentViewSet, basename='reelcomment')
router.register(r'story-views', StoryViewViewSet, basename='storyview')

urlpatterns = [
    path('', include(router.urls)),
]
