# FitManager — Gym Management App

A full-stack gym management system built with .NET 8 Web API + React + TypeScript.

## Tech Stack
- **Backend:** .NET 8, Entity Framework Core, SQLite, JWT Auth, FluentValidation, Swagger
- **Frontend:** React 18, TypeScript, Tailwind CSS, React Query, Zustand, Axios

---

## Getting started

### 1. Run the backend

Open a terminal in `FitManager/FitManager.API` and run:

```bash
dotnet restore
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate
dotnet run
```

API: http://localhost:5000  
Swagger: http://localhost:5000/swagger

### 2. Run the frontend

Open a second terminal in `FitManager/fitmanager-client`:

```bash
npm install
npm run dev
```

App: http://localhost:5173

---

## Demo credentials

| Username | Password | Role  |
|----------|----------|-------|
| admin    | admin123 | Admin |
| staff    | staff123 | Staff |
