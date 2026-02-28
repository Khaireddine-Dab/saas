# Utiliser une image Python officielle légère
FROM python:3.12-slim

# Définir des variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Définir le répertoire de travail
WORKDIR /app

# Forcer la préférence IPv4 (évite "Network is unreachable" si IPv6 est mal configuré)
RUN echo "precedence ::ffff:0:0/96 100" >> /etc/gai.conf

# On retire l'installation des outils de build (gcc, libpq-dev) 
# car on utilise psycopg2-binary qui ne nécessite pas de compilation.
# Cela évite aussi les erreurs de téléchargement APT sur certains réseaux.

# Copier le fichier requirements.txt depuis la racine du projet vers le container
COPY requirements.txt /app/

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste du code source
COPY backend/ /app/

# Exposer le port par défaut de Django
EXPOSE 8000

# Commande pour démarrer le serveur
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
