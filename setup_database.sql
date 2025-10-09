-- Script de configuration de la base de données PostgreSQL pour le SaaS
-- Exécuter ce script en tant qu'utilisateur postgres

-- Créer la base de données
CREATE DATABASE saas_db;

-- Créer un utilisateur (optionnel, peut utiliser postgres par défaut)
-- CREATE USER saas_user WITH PASSWORD 'saas_password';
-- GRANT ALL PRIVILEGES ON DATABASE saas_db TO saas_user;

-- Se connecter à la base de données pour les permissions
\c saas_db;

-- Permissions pour l'utilisateur (si créé)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO saas_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO saas_user;
