# Mini Trello

A Trello-like kanban board application built with NestJS, Next.js, and MongoDB.

## Architecture

This project uses Docker and Docker Compose for containerization.

## Services

- **MongoDB**: Database service (port 27017)
- **Backend**: NestJS API service (port 3000)
- **Frontend**: Next.js application (port 3001)

## Prerequisites

- Docker
- Docker Compose

## Getting Started

### 1. Setup Environment Variables

Copy the example environment file:

```bash
cp backend/.env.example backend/.env
```

### 2. Start Services

Start all services (backend, frontend, and MongoDB):

```bash
docker-compose up -d
```

Start specific services:

```bash
# Only MongoDB
docker-compose up -d mongodb

# Backend and MongoDB
docker-compose up -d mongodb backend

# Frontend only (requires backend to be running)
docker-compose up -d frontend
```

### 3. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### 4. Stop Services

```bash
docker-compose down
```

To remove volumes as well:

```bash
docker-compose down -v
```

## Development

### Running with Docker (Recommended)

The easiest way to run the application is with Docker Compose as described above.

### Running Locally (Without Docker)

#### Prerequisites
- Node.js 20+
- MongoDB running locally or accessible via connection string
- Yarn package manager

#### Backend Setup

```bash
cd backend
yarn install
cp .env.example .env
# Update MONGODB_URI in .env file
yarn start:dev
```

The backend API will be available at `http://localhost:3000`

#### Frontend Setup

```bash
cd frontend
yarn install
yarn dev
```

The frontend will be available at `http://localhost:3001`

## Database Credentials

Default MongoDB credentials (change in production):

- Username: `admin`
- Password: `admin123`
- Database: `minitrello`

## Application URLs

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017

## Features

- ✅ Create and manage multiple boards
- ✅ Add lists to boards
- ✅ Create cards within lists
- ✅ Move cards between lists
- ✅ Edit card titles and descriptions
- ✅ Delete boards, lists, and cards
- ✅ Responsive UI built with Next.js and Tailwind CSS
- ✅ RESTful API with NestJS
- ✅ MongoDB for data persistence

## API Endpoints

### Boards

- `POST /boards` - Create a new board
- `GET /boards` - List all boards
- `DELETE /boards/:id` - Delete a board

### Lists

- `POST /boards/:id/lists` - Add a list to a board
- `PUT /lists/:id` - Rename a list
- `DELETE /lists/:id` - Delete a list

### Cards

- `POST /lists/:id/cards` - Add a card to a list
- `PUT /cards/:id` - Edit card title/description
- `PUT /cards/:id/move` - Move card between lists
- `DELETE /cards/:id` - Delete a card

## Testing

### Backend Tests

```bash
cd backend

# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

### Frontend Tests

```bash
cd frontend

# Run all tests
yarn test

# Watch mode
yarn test:watch
```

## Technology Stack

### Backend
- **NestJS**: Progressive Node.js framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Jest**: Testing framework

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Jest & React Testing Library**: Testing tools

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration

## Health Checks

- Backend: `http://localhost:3000/health`
- MongoDB: Auto-checked via Docker health check
