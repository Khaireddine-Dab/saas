from django.urls import path
from .views import SignupView, LoginView, MeView, UserListView, UserDetailView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),
    path('list/', UserListView.as_view(), name='user-list'),
    path('<str:user_id>/', UserDetailView.as_view(), name='user-detail'),
]
