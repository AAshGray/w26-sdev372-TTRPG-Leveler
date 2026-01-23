# Backend Setup Instructions

## 1. Install Dependencies

```bash
cd backend
npm install
```

## 2. Configure Database Connection

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=ttrpg_leveler
DB_PORT=3306

PORT=3000
NODE_ENV=development
```

## 3. Start Backend Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## 4. Test the API

Visit: http://localhost:3000/api/health

## 5. Configure Frontend

In `TTRPG-Leveler` directory, create `.env`:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

## 6. Start Frontend

```bash
cd ../TTRPG-Leveler
npm run dev
```
