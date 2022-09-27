# Приложение для просмотра распасания

### Состоит из

- Парсера расписания
- Бота для telegram

### Запуск и настройка

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
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=qwerty123
DB_DATABASE=schedule-bmstu

# URL от сайта с расписанием
SITE_URL=https://lks.bmstu.ru/schedule/list

# Время устаревания данных (в мс)
TIME_OBSOLESCENT=86400000
```
