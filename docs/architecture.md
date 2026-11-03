# Architecture
React/TypeScript frontend -> Spring Boot REST API -> MySQL. Spring Boot calls the FastAPI ML service for predictions. Authentication uses JWT. The dashboard consumes aggregated country and scenario data. Decision Support combines backend cost calculations and ML predictions into a transparent weighted index.

## Data flow
User -> UI form -> REST DTO validation -> service -> database/ML service -> normalized response -> charts/table.

## Explainability
Classification models use model-derived probabilities plus a transparent factor list. The academic implementation does not claim causal inference. Synthetic data is used where historical hiring data is unavailable.
