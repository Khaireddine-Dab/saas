from django.urls import path
from . import views

app_name = 'organizations'

urlpatterns = [
    path('', views.OrganizationListCreateView.as_view(), name='list-create'),
    path('<int:pk>/', views.OrganizationDetailView.as_view(), name='detail'),
    path('<int:organization_id>/members/', views.OrganizationMembersView.as_view(), name='members'),
    path('<int:organization_id>/invite/', views.invite_member_view, name='invite'),
    path('invitations/<str:token>/accept/', views.accept_invitation_view, name='accept-invitation'),
    path('<int:organization_id>/members/<int:member_id>/remove/', views.remove_member_view, name='remove-member'),
]
