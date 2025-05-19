# Система бронирования рабочих мест

Микросервисное приложение для бронирования рабочих мест, построенное с использованием React, Go и Spring Boot.

## Архитектура

Проект состоит из следующих сервисов:
- Frontend (React)
- Auth Service (Go)
- Booking Service (Spring Boot)
- PostgreSQL

## Требования

- Docker
- Docker Compose

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/vushkv/booking-service.git
cd booking-service
```

2. Запустите приложение с помощью Docker Compose:
```bash
docker compose up --build
```

Приложение будет доступно по следующим адресам:
- Frontend: http://localhost:3001
- Auth Service: http://localhost:8083
- Booking Service: http://localhost:8082

## Функциональность

- Регистрация и авторизация пользователей
- Просмотр доступных рабочих мест
- Создание бронирований
- Просмотр и управление своими бронированиями

## Технологии

- Frontend:
    - React
    - Material-UI
    - React Router
    - Axios

- Auth Service:
    - Go
    - Gin
    - JWT
    - PostgreSQL

- Booking Service:
    - Spring Boot
    - Spring Data JPA
    - PostgreSQL

## Лицензия

MIT 