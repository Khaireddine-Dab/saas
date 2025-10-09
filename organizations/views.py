from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import Organization, OrganizationMember, OrganizationInvitation
from .serializers import (
    OrganizationSerializer, 
    OrganizationMemberSerializer, 
    OrganizationInvitationSerializer
)

User = get_user_model()


class OrganizationListCreateView(generics.ListCreateAPIView):
    """Liste et création d'organisations"""
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Organization.objects.filter(
            members__user=user, 
            members__is_active=True
        ).distinct()
    
    def perform_create(self, serializer):
        organization = serializer.save(owner=self.request.user)
        # Créer automatiquement un membre owner
        OrganizationMember.objects.create(
            organization=organization,
            user=self.request.user,
            role='owner'
        )


class OrganizationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détails d'une organisation"""
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Organization.objects.filter(
            members__user=user, 
            members__is_active=True
        ).distinct()


class OrganizationMembersView(generics.ListCreateAPIView):
    """Membres d'une organisation"""
    serializer_class = OrganizationMemberSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        organization_id = self.kwargs['organization_id']
        organization = get_object_or_404(Organization, id=organization_id)
        
        # Vérifier que l'utilisateur est membre de l'organisation
        if not OrganizationMember.objects.filter(
            organization=organization, 
            user=self.request.user, 
            is_active=True
        ).exists():
            return OrganizationMember.objects.none()
        
        return OrganizationMember.objects.filter(
            organization=organization, 
            is_active=True
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def invite_member_view(request, organization_id):
    """Inviter un membre à une organisation"""
    organization = get_object_or_404(Organization, id=organization_id)
    
    # Vérifier que l'utilisateur a le droit d'inviter
    membership = OrganizationMember.objects.filter(
        organization=organization,
        user=request.user,
        is_active=True,
        role__in=['owner', 'admin']
    ).first()
    
    if not membership:
        return Response(
            {'error': 'Vous n\'avez pas le droit d\'inviter des membres'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    email = request.data.get('email')
    role = request.data.get('role', 'member')
    
    if not email:
        return Response(
            {'error': 'Email requis'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Vérifier que l'email n'est pas déjà membre
    if OrganizationMember.objects.filter(
        organization=organization,
        user__email=email,
        is_active=True
    ).exists():
        return Response(
            {'error': 'Cet utilisateur est déjà membre'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Créer l'invitation
    invitation = OrganizationInvitation.objects.create(
        organization=organization,
        email=email,
        role=role,
        invited_by=request.user,
        token=f"inv_{organization.id}_{email}_{request.user.id}"
    )
    
    return Response(
        OrganizationInvitationSerializer(invitation).data,
        status=status.HTTP_201_CREATED
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_invitation_view(request, token):
    """Accepter une invitation"""
    invitation = get_object_or_404(OrganizationInvitation, token=token)
    
    if invitation.status != 'pending':
        return Response(
            {'error': 'Cette invitation n\'est plus valide'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if invitation.email != request.user.email:
        return Response(
            {'error': 'Cette invitation ne vous est pas destinée'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Créer le membre
    OrganizationMember.objects.create(
        organization=invitation.organization,
        user=request.user,
        role=invitation.role
    )
    
    # Marquer l'invitation comme acceptée
    invitation.status = 'accepted'
    invitation.save()
    
    return Response({
        'message': 'Invitation acceptée avec succès',
        'organization': OrganizationSerializer(invitation.organization).data
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_member_view(request, organization_id, member_id):
    """Retirer un membre d'une organisation"""
    organization = get_object_or_404(Organization, id=organization_id)
    
    # Vérifier que l'utilisateur a le droit de retirer des membres
    membership = OrganizationMember.objects.filter(
        organization=organization,
        user=request.user,
        is_active=True,
        role__in=['owner', 'admin']
    ).first()
    
    if not membership:
        return Response(
            {'error': 'Vous n\'avez pas le droit de retirer des membres'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    member = get_object_or_404(
        OrganizationMember, 
        id=member_id, 
        organization=organization
    )
    
    # Empêcher de retirer le propriétaire
    if member.role == 'owner':
        return Response(
            {'error': 'Impossible de retirer le propriétaire'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    member.is_active = False
    member.save()
    
    return Response({'message': 'Membre retiré avec succès'})