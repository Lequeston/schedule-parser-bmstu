# Приложение для просмотра распасания

### Состоит из

- Парсера расписания
- Бота для telegram

### Запуск и настройка (для использования)

- Сборка контейнера

  ```bash
  docker-compose build
  ```

- Запуск бота

  ```bash
  docker-compose up -d
  ```

### Запуск и настройка (для разработки)

- Скачиваем все зависимости

  ```bash
  yarn
  ```

- Запускаем СУБД

  ```bash
  docker-compose up -d
  ```

- Запуск приложения (для демонстрации)

  ```bash
  yarn start
  ```

- Сборка приложение в папку `dist`

  ```bash
  yarn build
  ```

- Запуск dev сервера

  ```bash
  yarn dev
  ```

### Конфигурация `.env`

```bash
# Токен от бота для telegram
BOT_TOKEN=

# Параметры доступа к бд (указаны тестовые данные)
DB_HOST=database
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=qwerty123
DB_DATABASE=schedule-bmstu

# Параметры доступа к кэшу
CACHE_HOST=cache
CACHE_PORT=6379
CACHE_PASSWORD=qwerty123

# URL от сайта с расписанием
SITE_URL=https://lks.bmstu.ru/schedule/list

# Время устаревания данных (в мс)
TIME_OBSOLESCENT=86400000
```
