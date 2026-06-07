from rest_framework import serializers
from .models import Reel, ReelStat, Story, StoryView, ReelComment

class ReelStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReelStat
        fields = '__all__'

class ReelCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReelComment
        fields = '__all__'

class ReelSerializer(serializers.ModelSerializer):
    stats = ReelStatSerializer(read_only=True)
    comments = ReelCommentSerializer(many=True, read_only=True)

    class Meta:
        model = Reel
        # Exclude 'embedding' since it's not defined in the model explicitly 
        # and we don't want it in the general API response.
        fields = [
            'id', 'store_id', 'media_path', 'media_type', 'title', 'subtitle', 
            'price', 'currency', 'cta_type', 'cta_value', 'category', 'is_sponsored', 
            'status', 'created_at', 'item_id', 'stats', 'comments'
        ]

class StoryViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryView
        fields = '__all__'

class StorySerializer(serializers.ModelSerializer):
    views = StoryViewSerializer(many=True, read_only=True)
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = Story
        fields = [
            'id', 'store_id', 'author_id', 'media_url', 'media_type', 'caption', 
            'views_count', 'is_approved', 'expires_at', 'created_at', 'views', 'is_active'
        ]
