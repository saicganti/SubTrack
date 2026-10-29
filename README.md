# SubTrack — Subscription & Recurring Expense Tracker

A full-stack subscription tracker built with ASP.NET Core, EF Core, Azure SQL, and React. Track recurring expenses, see monthly/yearly totals, and get a spending breakdown by category.

**Live demo:** https://subtrack-web-saicganti.azurestaticapps.net

## Screenshots
[4 images inline]

## Features
- JWT authentication with registration and login
- Subscription CRUD with category-based organization
- Dashboard: monthly/yearly totals, spending chart, upcoming renewals
- Background service scans for renewals in the next 7 days
- xUnit tests for billing-cycle math and dashboard calculations
- CI/CD via GitHub Actions; both projects auto-deploy on push to master

## Tech Stack
- **Backend:** C# 12, ASP.NET Core 8, EF Core 8, ASP.NET Core Identity, JWT, SQL Server
- **Frontend:** React 18, Vite, React Router, Axios, Recharts, Tailwind CSS
- **Cloud:** Azure App Service, Azure SQL, Azure Static Web Apps
- **Testing:** xUnit, EF Core InMemory

## Architecture
Browser → Azure Static Web Apps (React) → Azure App Service (ASP.NET Core API) → Azure SQL

## Local Development
[API and client commands]

## Design Notes
- **Category normalized to a FK table** — eliminates update anomalies and group-by typos from a free-text category.
- **`BillingCycle` kept as an enum** — a fixed closed set; new values require new date-math code, not new data.
- **Composite index on `(UserId, NextRenewalDate)`** — matches the two query shapes: filter by user, and filter by user + date range.
- **Check constraint `Cost > 0`** at the database level — validation protects the API; the constraint protects the data.
- **`EnsureCreated()` over migrations** — chosen for prototyping speed in a solo project; migrations are the next step before multi-developer work.
