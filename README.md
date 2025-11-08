# MangaTime

MangaTime is a full-stack application designed to help users track their manga reading progress, manage volumes, and explore new titles. The project consists of an Angular front-end and a .NET API backend with a SQL Server database.

## Features

- Search for manga titles
- View detailed manga information
- Track read volumes
- Bulk update read status for volumes
- Responsive and modern UI built with Angular standalone components
- REST API built with ASP.NET Core
- Database using SQL Server with Entity Framework Core

## Tech Stack

### Front-end (Angular)
- Angular standalone components
- SCSS theming
- Custom UI components for volume tracking
- HTTP communication with the backend

### Back-end (.NET)
- ASP.NET Core Web API
- Entity Framework Core (Code First)
- Repository and service architecture
- DTO mapping

### Database
- SQL Server 2022
- EF Core migrations
- Dockerized local development database

### Requirements
- Node.js LTS
- .NET 8 SDK
- Docker Desktop (for SQL Server)

## API Endpoints

### GET /manga
Search manga with optional query and pagination.

### GET /manga/{id}
Retrieve detailed manga information.

### POST /manga
Create a new manga entry.

### POST /manga/{id}/volumes/bulk
Bulk update read status for volumes.

## Roadmap

- User accounts and authentication
- Covers and media integration
- Manga lists (want to read, reading, completed)
- Improved search with external API integration
- Enhanced UI/UX styling and animations
