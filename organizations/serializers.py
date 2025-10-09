from rest_framework import serializers
from .models import Organization, OrganizationMember, OrganizationInvitation


class OrganizationMemberSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = OrganizationMember
        fields = ['id', 'user', 'user_email', 'user_name', 'role', 'joined_at', 'is_active']
        read_only_fields = ['id', 'joined_at']


class OrganizationSerializer(serializers.ModelSerializer):
    members = OrganizationMemberSerializer(many=True, read_only=True)
    member_count = serializers.SerializerMethodField()
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    
    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'slug', 'description', 'website', 'logo',
            'owner', 'owner_name', 'is_active', 'settings', 'members',
            'member_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner']
    
    def get_member_count(self, obj):
        return obj.members.filter(is_active=True).count()


class OrganizationInvitationSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    invited_by_name = serializers.CharField(source='invited_by.get_full_name', read_only=True)
    
    class Meta:
        model = OrganizationInvitation
        fields = [
            'id', 'organization', 'organization_name', 'email', 'role',
            'invited_by', 'invited_by_name', 'status', 'expires_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'invited_by', 'status', 'token', 'created_at', 'updated_at'
        ]
