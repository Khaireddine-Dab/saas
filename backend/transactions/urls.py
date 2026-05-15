from django.urls import path
from .views import (
    TransactionListView,
    TransactionDetailView,
    TransactionByMerchantView,
    TransactionByCustomerView,
    TransactionStatsView,
    SuccessfulTransactionsView,
    FailedTransactionsView,
)

app_name = 'transactions'

urlpatterns = [
    # Transaction CRUD
    path('', TransactionListView.as_view(), name='transaction-list'),
    path('<uuid:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),

    # Merchant-specific transactions
    path('merchant/<int:merchant_id>/', TransactionByMerchantView.as_view(), name='transactions-by-merchant'),

    # Customer-specific transactions
    path('customer/<uuid:customer_id>/', TransactionByCustomerView.as_view(), name='transactions-by-customer'),

    # Statistics
    path('stats/', TransactionStatsView.as_view(), name='transaction-stats'),

    # Filtered views
    path('successful/', SuccessfulTransactionsView.as_view(), name='successful-transactions'),
    path('failed/', FailedTransactionsView.as_view(), name='failed-transactions'),
]
