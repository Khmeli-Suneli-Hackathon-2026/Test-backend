# Todo App — Backend API

## Запуск

```bash
npm install
npm run dev
```

Сервер запускається на: `http://localhost:5000`

---

## Змінні середовища (.env)

```env
PORT=5000
DB_URL=mysql://...
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:3000
```

---

## Авторизація

Використовуються **JWT-токени**.

Після логіну отримуєте токен і передаєте його в **кожному** захищеному запиті у заголовку:

```
Authorization: Bearer <token>
```

---

## Endpoints

### 🔐 Auth

#### POST `/api/auth/register` — Реєстрація
Не потребує токена.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Користувача створено"
}
```

---

#### POST `/api/auth/login` — Логін
Не потребує токена.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Response `200`:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

---

### ✅ Todos

> ⚠️ Усі запити нижче потребують заголовок `Authorization: Bearer <token>`

---

#### GET `/api/todos` — Отримати список тасок

Повертає лише таски поточного авторизованого користувача.

**Query параметри (опціонально):**

| Параметр | Значення | Опис |
|----------|----------|------|
| `urgency` | `LOW` \| `MEDIUM` \| `HIGH` | Фільтр за терміновістю |

**Приклад:** `GET /api/todos?urgency=HIGH`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "title": "Назва задачі",
      "description": "Опис задачі",
      "urgency": "HIGH",
      "createdAt": "2026-04-30T20:21:42.000Z"
    }
  ]
}
```

> Масив тасок лежить всередині об'єкта у полі `data`.

---

#### POST `/api/todos` — Створити таску

**Request body:**
```json
{
  "title": "Назва задачі",
  "description": "Опис задачі",
  "urgency": "LOW"
}
```

| Поле | Тип | Обов'язкове | За замовчуванням |
|------|-----|-------------|------------------|
| `title` | string | ✅ | — |
| `description` | string | ❌ | `""` |
| `urgency` | `LOW` \| `MEDIUM` \| `HIGH` | ❌ | `"LOW"` |

**Response `201`:**
```json
{
  "success": true,
  "message": "Задачу успішно створено",
  "data": {
    "id": 5,
    "title": "Назва задачі",
    "urgency": "LOW"
  }
}
```

---

#### PUT `/api/todos/:id` — Оновити таску

> Можна передати одне або декілька полів — оновляться тільки передані.

**Request body:**
```json
{
  "title": "Нова назва",
  "description": "Новий опис",
  "urgency": "HIGH"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Задачу успішно оновлено",
  "data": {
    "id": 5,
    "userId": 1,
    "title": "Нова назва",
    "description": "Новий опис",
    "urgency": "HIGH",
    "createdAt": "2026-04-30T20:21:42.000Z"
  }
}
```

---

#### DELETE `/api/todos/:id` — Видалити таску

Тіло запиту не потрібне.

**Response `200`:**
```json
{
  "success": true,
  "message": "Задачу успішно видалено"
}
```

---

## Помилки

Всі помилки повертаються у форматі:

```json
{
  "message": "Текст помилки"
}
```

| Статус | Причина |
|--------|---------|
| `400` | Невалідні дані запиту |
| `401` | Токен відсутній або невалідний |
| `404` | Таску не знайдено або вона не належить користувачу |

---

## CORS

Дозволені запити з: `http://localhost:3000`
