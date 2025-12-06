# API Reference

The Backend exposes a RESTful API documented via OpenAPI (Swagger).

**Base URL**: `http://localhost:8000/api/v1`
**Swagger UI**: `http://localhost:8000/docs`

## Endpoints

### Agents

-   `GET /agents`: List all agents.
-   `POST /agents`: Create a new agent.
    -   **Body**:
        ```json
        {
          "name": "My Agent",
          "description": "Optional description",
          "graph": { ... } // JSON representation of nodes/edges
        }
        ```
-   `GET /agents/{id}`: Get agent details.
-   `PATCH /agents/{id}`: Update agent graph or metadata.
-   `POST /agents/{id}/run`: Trigger an execution.
    -   **Body**:
        ```json
        {
          "input_data": {
            "input": "This is the user prompt"
          }
        }
        ```
    -   **Response**: Returns a `run_id`.

### Runs

-   `GET /runs/{id}`: Get status and results of a run.
    -   **Response**:
        ```json
        {
          "id": "uuid",
          "status": "completed", // pending, running, completed, failed
          "output_data": { ... },
          "logs": [ ... ]
        }
        ```

## Authentication
*Currently stubbed for MVP/Local Dev.*
In a production environment, requests should include an Authorization header:
`Authorization: Bearer <token>`
