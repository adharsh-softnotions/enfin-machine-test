# Next.js Project for Machine Test

This project is bootstrapped with [Next.js](https://nextjs.org) using `create-next-app`.

## Getting Started

### Prerequisites

Before starting the project, ensure you have seeded the necessary data into Redis. A seeder function is provided within the Next.js app for this purpose.

Run the following command to seed data into the Redis database:

```bash
npm run seed
```

Run the following command run the next js project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Primary Client Route

- **Participant Availability**: [http://localhost:3000/participant/availability](http://localhost:3000/participant/availability) — This page includes the client-specified requirements and is the primary path for testing.

