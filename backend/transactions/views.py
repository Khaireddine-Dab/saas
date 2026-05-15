from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from django.db.models import Sum, Avg, Count, Q
from django.utils import timezone

from .models import Transaction
from .serializers import (
    TransactionListSerializer,
    TransactionDetailSerializer,
   TransactionCreateUpdateSerializer,
)


class TransactionListView(APIView):
    """
    GET: List all transactions (optionally filtered)
    POST: Create a new transaction
    """
    permission_classes = [AllowAny]

    def get(self, request):
        """Retrieve transactions with optional filters"""
        status_filter = request.query_params.get('status')
        type_filter = request.query_params.get('type')
        merchant_id = request.query_params.get('merchant_id')
        customer_id = request.query_params.get('customer_id')

        queryset = Transaction.objects.all()

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if type_filter:
            queryset = queryset.filter(type=type_filter)
        if merchant_id:
            queryset = queryset.filter(merchant_id=merchant_id)
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)

        serializer = TransactionListSerializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data,
        })

    def post(self, request):
        """Create a new transaction"""
        serializer = TransactionCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionDetailView(APIView):
    """
    GET: Retrieve a specific transaction
    PUT: Update a specific transaction
    DELETE: Delete a specific transaction
    """
    permission_classes = [AllowAny]

    def get_transaction(self, pk):
        """Helper to get transaction or return 404"""
        try:
            return Transaction.objects.get(pk=pk)
        except Transaction.DoesNotExist:
            return None

    def get(self, request, pk):
        """Retrieve a specific transaction"""
        transaction = self.get_transaction(pk)
        if not transaction:
            return Response(
                {'detail': 'Transaction not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = TransactionDetailSerializer(transaction)
        return Response(serializer.data)

    def put(self, request, pk):
        """Update a specific transaction"""
        transaction = self.get_transaction(pk)
        if not transaction:
            return Response(
                {'detail': 'Transaction not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = TransactionCreateUpdateSerializer(transaction, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete a specific transaction"""
        transaction = self.get_transaction(pk)
        if not transaction:
            return Response(
                {'detail': 'Transaction not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        transaction.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TransactionByMerchantView(APIView):
    """
    GET: List transactions for a specific merchant/store
    """
    permission_classes = [AllowAny]

    def get(self, request, merchant_id):
        """Retrieve all transactions for a merchant"""
        status_filter = request.query_params.get('status')
        type_filter = request.query_params.get('type')

        queryset = Transaction.objects.filter(merchant_id=merchant_id)

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if type_filter:
            queryset = queryset.filter(type=type_filter)

        serializer = TransactionListSerializer(queryset, many=True)
        return Response({
            'merchant_id': merchant_id,
            'count': queryset.count(),
            'results': serializer.data,
        })


class TransactionByCustomerView(APIView):
    """
    GET: List transactions for a specific customer
    """
    permission_classes = [AllowAny]

    def get(self, request, customer_id):
        """Retrieve all transactions for a customer"""
        status_filter = request.query_params.get('status')
        type_filter = request.query_params.get('type')

        queryset = Transaction.objects.filter(customer_id=customer_id)

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if type_filter:
            queryset = queryset.filter(type=type_filter)

        serializer = TransactionListSerializer(queryset, many=True)
        return Response({
            'customer_id': customer_id,
            'count': queryset.count(),
            'results': serializer.data,
        })


class TransactionStatsView(APIView):
    """
    GET: Transaction statistics and aggregates
    Returns totals, counts, averages by status/type
    """
    permission_classes = [AllowAny]

    def get(self, request):
        """Retrieve transaction statistics"""
        merchant_id = request.query_params.get('merchant_id')
        customer_id = request.query_params.get('customer_id')

        try:
            queryset = Transaction.objects.all()
            if merchant_id:
                queryset = queryset.filter(merchant_id=merchant_id)
            if customer_id:
                queryset = queryset.filter(customer_id=customer_id)

            # Get aggregate totals
            aggregates = queryset.aggregate(
                total_amount=Sum('amount'),
                total_fee=Sum('fee'),
                total_count=Count('id'),
            )
            
            total_amount = aggregates['total_amount'] or 0
            total_fee = aggregates['total_fee'] or 0
            total_transactions = aggregates['total_count'] or 0

            # Status breakdown - only use statuses that exist
            status_breakdown = {}
            for status in ['completed', 'pending', 'failed']:
                status_breakdown[status] = queryset.filter(status=status).count()

            # Type breakdown - only use types that exist in database
            type_breakdown = {}
            for txn_type in ['payment', 'refund']:
                type_breakdown[txn_type] = queryset.filter(type=txn_type).count()

            # Success rate
            completed_count = status_breakdown.get('completed', 0)
            success_rate = (completed_count / total_transactions * 100) if total_transactions > 0 else 0

            stats = {
                'total_transactions': total_transactions,
                'total_amount': float(total_amount),
                'total_fee': float(total_fee),
                'net_amount': float(total_amount) - float(total_fee),
                'avg_amount': float(total_amount / total_transactions) if total_transactions > 0 else 0,
                'status': status_breakdown,
                'type': type_breakdown,
                'success_rate': round(success_rate, 2),
            }
            return Response(stats)
        except Exception as e:
            # If RLS policies block the query, return empty stats
            return Response({
                'total_transactions': 0,
                'total_amount': 0,
                'total_fee': 0,
                'net_amount': 0,
                'avg_amount': 0,
                'status': {
                    'completed': 0,
                    'pending': 0,
                    'failed': 0,
                },
                'type': {
                    'payment': 0,
                    'refund': 0,
                    'payout': 0,
                },
                'success_rate': 0,
                'error': 'Stats unavailable without authentication',
            })


class SuccessfulTransactionsView(APIView):
    """
    GET: List only completed transactions
    """
    permission_classes = [AllowAny]

    def get(self, request):
        """Retrieve completed transactions"""
        merchant_id = request.query_params.get('merchant_id')
        customer_id = request.query_params.get('customer_id')

        queryset = Transaction.objects.filter(status='completed')

        if merchant_id:
            queryset = queryset.filter(merchant_id=merchant_id)
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)

        serializer = TransactionListSerializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data,
        })


class FailedTransactionsView(APIView):
    """
    GET: List failed or pending transactions
    """
    permission_classes = [AllowAny]

    def get(self, request):
        """Retrieve failed/pending transactions"""
        merchant_id = request.query_params.get('merchant_id')
        customer_id = request.query_params.get('customer_id')

        queryset = Transaction.objects.filter(
            Q(status='failed') | Q(status='pending')
        )

        if merchant_id:
            queryset = queryset.filter(merchant_id=merchant_id)
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)

        serializer = TransactionListSerializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data,
        })
