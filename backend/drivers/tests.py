from django.test import TestCase
from django.utils import timezone
from .models import Driver


class DriverModelTests(TestCase):
    """Tests pour le modèle Driver"""

    def setUp(self):
        """Crée un livreur de test"""
        self.driver = Driver.objects.create(
            name='Ahmed Hassan',
            email='ahmed@example.com',
            phone='+216 92 123 456',
            status=Driver.Status.ACTIVE,
            vehicle_type=Driver.VehicleType.CAR,
            vehicle_license_plate='TN-2024-001',
            vehicle_make='Toyota',
            vehicle_model='Corolla',
            vehicle_year=2023,
            rating=4.8,
        )

    def test_driver_creation(self):
        """Test la création d'un livreur"""
        self.assertEqual(self.driver.name, 'Ahmed Hassan')
        self.assertEqual(self.driver.email, 'ahmed@example.com')
        self.assertEqual(self.driver.status, Driver.Status.ACTIVE)

    def test_driver_string_representation(self):
        """Test la représentation en string du livreur"""
        self.assertEqual(str(self.driver), 'Ahmed Hassan (ahmed@example.com)')

    def test_driver_default_values(self):
        """Test les valeurs par défaut"""
        self.assertEqual(self.driver.total_deliveries, 0)
        self.assertEqual(self.driver.rating, 4.8)
        self.assertEqual(self.driver.completion_rate, 100.0)
        self.assertEqual(self.driver.acceptance_rate, 100.0)

    def test_driver_status_choices(self):
        """Test les choix de statut"""
        self.assertIn(Driver.Status.ACTIVE, [value for value, _ in Driver.Status.choices])
        self.assertIn(Driver.Status.INACTIVE, [value for value, _ in Driver.Status.choices])

    def test_driver_vehicle_type_choices(self):
        """Test les choix de type de véhicule"""
        self.assertIn(Driver.VehicleType.CAR, [value for value, _ in Driver.VehicleType.choices])
        self.assertIn(Driver.VehicleType.MOTORCYCLE, [value for value, _ in Driver.VehicleType.choices])

    def test_driver_unique_email(self):
        """Test l'unicité de l'email"""
        with self.assertRaises(Exception):
            Driver.objects.create(
                name='Another Driver',
                email='ahmed@example.com',  # Email déjà utilisé
                phone='+216 93 234 567',
            )

    def test_driver_unique_license_plate(self):
        """Test l'unicité de la plaque d'immatriculation"""
        with self.assertRaises(Exception):
            Driver.objects.create(
                name='Another Driver',
                email='another@example.com',
                phone='+216 93 234 567',
                vehicle_license_plate='TN-2024-001',  # Plaque déjà utilisée
            )
