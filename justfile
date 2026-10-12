# Development commands for ERNS.

default: help

help:
    @just --list

# Start the local PostgreSQL and Mailpit services.
[group('Development')]
dev-up:
    docker compose up -d

# Stop local services.
[group('Development')]
dev-down:
    docker compose down

# Stop local services and remove database volumes.
[group('Development')]
dev-clean:
    docker compose down -v

# Generate the Prisma client and apply local migrations.
[group('Database')]
db-setup:
    pnpm prisma:generate
    pnpm prisma:deploy

# Start the application after local infrastructure is available.
[group('Development')]
dev: dev-up db-setup
    pnpm dev
