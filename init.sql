-- Создание базы данных для авторизации
CREATE DATABASE auth_db;

-- Создание пользователя для авторизации
CREATE ROLE auth_user WITH LOGIN PASSWORD 'auth_password';
GRANT ALL PRIVILEGES ON DATABASE auth_db TO auth_user;

-- Подключение к базе данных auth_db
\c auth_db
GRANT ALL ON SCHEMA public TO auth_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO auth_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO auth_user;

-- Создание базы данных для бронирования
\c postgres
CREATE DATABASE booking_db;

-- Создание пользователя для бронирования
CREATE ROLE booking_user WITH LOGIN PASSWORD 'booking_password';
GRANT ALL PRIVILEGES ON DATABASE booking_db TO booking_user;

-- Подключение к базе данных booking_db
\c booking_db
GRANT ALL ON SCHEMA public TO booking_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO booking_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO booking_user;