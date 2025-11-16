# Mini Trello - Docker Setup

This project uses Docker and Docker Compose for containerization.

## Services

- **MongoDB**: Database service (port 27017)
- **Backend**: NestJS API service (port 3000)

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

Start all services:

```bash
docker-compose up -d
```

Start only MongoDB:

```bash
docker-compose up -d mongodb
```

### 3. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
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

For local development without Docker, ensure you have:

- Node.js 20+
- MongoDB running locally or accessible via connection string

Update the `MONGODB_URI` in your `.env` file accordingly.

## Database Credentials

Default MongoDB credentials (change in production):

- Username: `admin`
- Password: `admin123`
- Database: `minitrello`

## API Endpoints

The backend will be available at `http://localhost:3000`

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

## Health Checks

- Backend: `http://localhost:3000/health`
- MongoDB: Auto-checked via Docker health check
