# User Tasks API

The **User Tasks API** is a Node.js application built with Express.js framework. It provides endpoints for managing user tasks.

## Prerequisites

- Node.js (v12 or above)
- npm (Node Package Manager)

## Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory.
3. Install dependencies by running the following command: `npm install`

## Usage

1. Set up the database connection by updating the **config/dbConnection.js** file with your database credentials.

2. Start the application by running the following command: `npm start`

3. The API server will start running on port 3000.

## API Endpoints

The API provides the following endpoints:

- **GET /api/tasks**: Retrieve all tasks.
- **GET /api/tasks/:id**: Retrieve a specific task by ID.
- **POST /api/tasks**: Create a new task.
- **PUT /api/tasks/:id**: Update a specific task by ID.
- **DELETE /api/tasks/:id**: Delete a specific task by ID.

## Project Structure

The project structure is as follows:

- **config/dbConnection.js**: Contains the database connection setup.
- **routes/usertasksRoutes.js**: Defines the API routes for user tasks.
- **views**: Contains the views for rendering HTML templates (if applicable).

## Dependencies

The main dependencies used in this project are:

- **express**: Web framework for creating the API server.
- **body-parser**: Middleware for parsing incoming request bodies.
- **cookie-parser**: Middleware for parsing cookies.
- **ejs**: Templating engine for rendering dynamic HTML templates.
- **mongoose**: MongoDB object modeling for database operations.

## Configuration

- Update the **config/dbConnection.js** file with your database connection details.

## Notes

- Ensure that you have a MongoDB database set up and running before starting the application.

- You can modify the API routes and add additional functionality as per your requirements.

- For detailed information on how to use the API endpoints, refer to the API documentation or Postman collection.

