#!/usr/bin/env python
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saas_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Créer un superutilisateur par défaut
email = 'admin@saas.com'
username = 'admin'
password = 'admin123'
first_name = 'Admin'
last_name = 'User'

if User.objects.filter(email=email).exists():
    print(f"L'utilisateur {email} existe déjà.")
else:
    user = User.objects.create_superuser(
        email=email,
        username=username,
        password=password,
        first_name=first_name,
        last_name=last_name
    )
    print(f"Superutilisateur créé avec succès:")
    print(f"Email: {email}")
    print(f"Username: {username}")
    print(f"Password: {password}")
    print(f"Nom: {first_name} {last_name}")
