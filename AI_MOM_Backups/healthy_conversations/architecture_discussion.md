# Architecture Discussion: Tenant Isolation

**Date:** July 14, 2026

## Topic
We discussed how to isolate data between different enterprises (e.g. Ashok Jewels vs others) on the same database.

## Outcome
Decided to use Prisma Row-Level Security via a `tenantId` parameter on every single query instead of a dynamic database router, to save overhead on Postgres connections.
