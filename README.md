# Vale Technical Challenge

## Prerequisites

* Node.js 23+
* npm

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Running the Application

### Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:8000
```

### Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## API Endpoint

### POST /ping

Request:

```json
{
  "message": "hello"
}
```

Response:

```json
{
  "echo": "hello",
  "timestamp": 1748540000,
  "env": "development",
  "version": "0.0.0"
}
```

## Validation Rules

The frontend validates the message before submitting:

* Message must be 20 characters or fewer.
* Message must be all lowercase.

If validation fails, the API request is not sent.

## UI States

The application handles and displays the following states:

* Loading
* Success
* Validation Error
* API / Network Error
