from django.urls import path
from . import views

app_name = 'subscriptions'

urlpatterns = [
    path('plans/', views.PlanListView.as_view(), name='plans'),
    path('subscriptions/', views.UserSubscriptionView.as_view(), name='list-create'),
    path('subscriptions/<uuid:pk>/', views.SubscriptionDetailView.as_view(), name='detail'),
    path('subscriptions/create/<int:plan_id>/', views.create_subscription_view, name='create'),
    path('subscriptions/<uuid:subscription_id>/cancel/', views.cancel_subscription_view, name='cancel'),
    path('subscriptions/<uuid:subscription_id>/usage/', views.subscription_usage_view, name='usage'),
    path('subscriptions/<uuid:subscription_id>/usage/update/', views.update_usage_view, name='update-usage'),
    path('invoices/', views.user_invoices_view, name='invoices'),
]
