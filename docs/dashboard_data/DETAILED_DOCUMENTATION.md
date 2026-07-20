# DETAILED_DOCUMENTATION

## Architecture
- Hybrid Microservices stack
- FastAPI (Python) backend for heavy algorithmic logic/margin calculations
- Node.js layer for administrative CRUD routing
- Next.js (React) frontend for the Server-Driven UI (SDUI) storefronts
- Local automation pipelines (n8n/PowerShell) remain active

## Data Structure
- TBD based on subsequent phase integrations

## Connectivity
- Live MCX bullion feeds via Redis caching (planned)
- PostgreSQL logic and Shopify CSV metafield mappings (planned)
