from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, force_authenticate
from rest_framework import status
from decimal import Decimal
import uuid
from .models import Transaction


class TransactionModelTest(TestCase):
    """Test Transaction model"""

    def setUp(self):
        self.customer_id = uuid.uuid4()
        self.merchant_id = 1
        self.transaction = Transaction.objects.create(
            customer_id=self.customer_id,
            merchant_id=self.merchant_id,
            type='payment',
            status='completed',
            amount=Decimal('100.00'),
            fee=Decimal('10.00'),
            booking_id=12345,
            driver_name='Ahmed',
        )

    def test_transaction_creation(self):
        """Test transaction object creation"""
        self.assertEqual(self.transaction.customer_id, self.customer_id)
        self.assertEqual(self.transaction.merchant_id, self.merchant_id)
        self.assertEqual(self.transaction.type, 'payment')
        self.assertEqual(self.transaction.status, 'completed')

    def test_net_amount_calculation(self):
        """Test computed net_amount property"""
        self.assertEqual(self.transaction.net_amount, Decimal('90.00'))

    def test_transaction_string_representation(self):
        """Test transaction __str__"""
        str_repr = str(self.transaction)
        self.assertIn(str(self.transaction.id), str_repr)


class TransactionAPITest(APITestCase):
    """Test Transaction API endpoints"""

    def setUp(self):
        self.customer_id = uuid.uuid4()
        self.merchant_id = 1

    def test_transaction_list_endpoint(self):
        """Test GET /api/transactions/"""
        Transaction.objects.create(
            customer_id=self.customer_id,
            merchant_id=self.merchant_id,
            type='payment',
            status='completed',
            amount=Decimal('100.00'),
            fee=Decimal('10.00'),
        )
        response = self.client.get('/api/transactions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_transaction_filter_by_status(self):
        """Test filtering transactions by status"""
        Transaction.objects.create(
            customer_id=self.customer_id,
            merchant_id=self.merchant_id,
            type='payment',
            status='completed',
            amount=Decimal('100.00'),
            fee=Decimal('10.00'),
        )
        response = self.client.get('/api/transactions/?status=completed')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
