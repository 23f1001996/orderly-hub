# Orderly Hub — Integrated App

A full-stack restaurant management app with a Flask backend (Python) and a React + TypeScript frontend (Vite).

---

## Prerequisites

- **Python 3.10+**
- **Node.js 18+** (and `npm`)

---

## Setup & Run

### 1. Backend

```bash
# From the project root (orderly-hub/)
cd orderly-hub

python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

python app.py
```

The Flask server starts on **http://localhost:5000**.

> First run auto-creates the SQLite database (`instance/quiz.sqlite3`) and seeds the three roles: `owner`, `server`, `customer`.

---

### 2. Frontend

Open a **new terminal**:

```bash
cd orderly-hub/frontend

npm install
npm run dev
```

The Vite dev server starts on **http://localhost:8080** and proxies all `/api` requests to Flask — no CORS setup needed.

---

## First Steps

1. Open **http://localhost:8080**
2. Click **Register** and create accounts for each role:
   - **Admin / Owner** — full management access
   - **Waiter** — service grid, orders, billing
   - **Customer** — browse menu, cart, order tracking

3. Log in with the registered credentials.

> **Role mapping** — the frontend labels map to backend role names as follows:
> | Frontend | Backend |
> |----------|---------|
> | Admin    | owner   |
> | Waiter   | server  |
> | Customer | customer |

---

## Project Structure

```
orderly-hub/
├── app.py                  # Flask entry point
├── requirements.txt
├── templates/
│   └── index.html          # Flask fallback template
├── backend/
│   ├── config.py
│   ├── database.py
│   ├── models.py           # SQLAlchemy models
│   ├── routes.py           # Auth routes (/api/login, /api/register, etc.)
│   └── resources/
│       ├── __init__.py     # Flask-RESTful API registration
│       ├── menu_api.py
│       ├── order_api.py
│       ├── table_api.py
│       └── feedback_api.py
└── frontend/               # React + TypeScript + Vite
    ├── src/
    │   ├── services/api.ts  # All API calls (auth token, fetch wrappers)
    │   ├── contexts/AuthContext.tsx
    │   ├── pages/
    │   │   ├── admin/
    │   │   ├── waiter/
    │   │   └── customer/
    │   └── ...
    └── vite.config.ts       # Proxy: /api → http://localhost:5000
```

---

## API Reference (brief)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/login` | — | Login, returns auth token |
| POST | `/api/register` | — | Register new user |
| POST | `/api/logout` | ✓ | Logout |
| GET | `/api/user` | ✓ | Current user info |
| GET/POST | `/api/tables` | ✓ | List / create tables |
| PUT/DELETE | `/api/tables/<id>` | ✓ | Update / delete table |
| GET/POST | `/api/categories` | ✓ | List / create categories |
| GET/POST | `/api/menu` | ✓ | List / create menu items |
| PUT/DELETE | `/api/menu/<id>` | ✓ | Update / delete menu item |
| GET/POST | `/api/orders` | ✓ | List / create orders |
| PUT | `/api/orders/<id>` | ✓ | Mark order as completed |
| POST | `/api/order_items` | ✓ | Add item to order |
| GET/POST | `/api/feedback` | ✓ | List / submit feedback |
