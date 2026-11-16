# FitManager

Gym management app: members, membership plans, payments, and attendance.
Built with a .NET 8 Web API and a React + TypeScript client.

## Tech stack
- **Backend:** .NET 8, ASP.NET Core Web API, Entity Framework Core, SQLite, JWT authentication, BCrypt, Swagger
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Query, Zustand, Axios

## Getting started

### Prerequisites
- .NET 8 SDK
- Node.js (LTS)

### Backend
```bash
cd FitManager.API
dotnet user-secrets set "Jwt:Key" "<any random text, at least 32 characters>"
dotnet run
```
The app applies the migrations and adds demo data on the first run.
Swagger: http://localhost:57264/swagger

### Frontend
```bash
cd fitmanager-client
npm install
npm run dev
```
The app opens at http://localhost:5173.

## Demo credentials (seed data only)
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin: full access |
| staff | staff123 | Staff: read and check-in |

## Project status
- Done: JWT login with roles, members, plans, payments, attendance, and dashboard endpoints (API)
- In progress: client pages for memberships, payments, and attendance