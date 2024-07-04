# Spivak Spendbase Test

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)

## Features

- Fetch current, minutely, hourly, daily weather data and alerts from OpenWeatherMap API
- Store and retrieve weather data from a PostgreSQL database
- API documentation with Swagger
- Input validation with class-validator
- Response transformation using interceptors

## Prerequisites

- Node.js (version 20.x or later)
- npm (version 6.x or later)
- PostgreSQL (version 12 or later)
- Docker (optional, for containerization)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dmytro-spi/spendbase_test.git
   cd spendbase_test
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the root directory with the following content:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_DATABASE=your_db_name
   OPENWEATHER_API_KEY=your_openweather_api_key
   ```

4. **Set up the database:**
   ```bash
   npm run typeorm migration:run
   ```

## Usage

1. **Start the application:**
   ```bash
   npm run build
   npm run start
   ```
   or (in development mode)
   ```bash
    npm run start:dev
    ```
   or (with Docker-Compose)
   ```bash
    docker-compose build
    docker-compose up
    ```
   or (with Docker)
   ```bash
    docker build -t spendbase_test .
    docker run -p 3000:3000 spendbase_test
    ```

2. **The API will be available at `http://localhost:3000`**

## API Documentation

Swagger documentation is available at `http://localhost:3000/api`.

## Running Tests

1. **Run unit tests:**
   ```bash
   npm run test
   ```

2**Run test coverage:**
   ```bash
   npm run test:cov
   ```
