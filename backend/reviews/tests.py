from django.test import TestCase
from django.utils import timezone
from .models import Review, ReviewFlag
from users.models import User
from items.models import Item, Product
from stores.models import Store


class ReviewModelTests(TestCase):
    """Tests pour le modèle Review"""

    def setUp(self):
        """Crée une revue de test"""
        self.user = User.objects.create(
            email='reviewer@test.com',
            full_name='Test Reviewer'
        )
        
        self.store = Store.objects.create(
            name='Test Store',
            email='store@test.com'
        )
        
        self.review = Review.objects.create(
            user=self.user,
            store=self.store,
            title='Excellent produit',
            content='Très satisfait de mon achat',
            rating=5,
            status=Review.Status.APPROVED,
            verified=True
        )

    def test_review_creation(self):
        """Test la création d'une revue"""
        self.assertEqual(self.review.title, 'Excellent produit')
        self.assertEqual(self.review.rating, 5)
        self.assertEqual(self.review.status, Review.Status.APPROVED)

    def test_review_string_representation(self):
        """Test la représentation en string de la revue"""
        expected = f"Review by {self.user.email} - 5★"
        self.assertEqual(str(self.review), expected)

    def test_review_default_values(self):
        """Test les valeurs par défaut"""
        self.assertEqual(self.review.spam_score, 0.0)
        self.assertEqual(self.review.helpful, 0)
        self.assertEqual(self.review.unhelpful, 0)
        self.assertFalse(self.review.flagged)

    def test_review_status_choices(self):
        """Test les choix de statut"""
        self.assertIn(Review.Status.APPROVED, [value for value, _ in Review.Status.choices])
        self.assertIn(Review.Status.PENDING, [value for value, _ in Review.Status.choices])

    def test_review_rating_choices(self):
        """Test les choix de rating"""
        self.assertEqual(self.review.rating, 5)
        self.assertGreaterEqual(self.review.rating, 1)
        self.assertLessEqual(self.review.rating, 5)

    def test_review_flag_creation(self):
        """Test la création d'un flag"""
        flag = ReviewFlag.objects.create(
            review=self.review,
            reason=ReviewFlag.Reason.SPAM,
            count=1
        )
        
        self.assertEqual(flag.review, self.review)
        self.assertEqual(flag.reason, ReviewFlag.Reason.SPAM)
        self.assertEqual(flag.status, ReviewFlag.Status.PENDING)
