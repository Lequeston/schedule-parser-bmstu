# Приложение для просмотра распасания

### Состоит из

- Парсера расписания
- Бота для telegram

### Запуск и настройка

- Скачиваем все зависимости

  ```bash
  yarn
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
# URL доступа к бд
DB_URL=
# URL от сайта с расписанием
SITE_URL=https://lks.bmstu.ru/schedule/list
```
