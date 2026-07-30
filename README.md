# Activity Planner

See [activity-planner-plan.md](./activity-planner-plan.md) for the full build plan, API contract, and task split between Person 1 and Person 2.

## Setup

```bash
# server
cd server
cp .env.example .env   # fill in JWT_SECRET / Google OAuth creds as needed
npm install
npm run dev             # http://localhost:3000

# client (separate terminal)
cd client
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

## Structure

```
/client        # Vite + React + TS
/server        # Express + TS
  /data        # app.db lives here (gitignored)
  /src
    schema.sql
    /lib       # db.ts, auth.ts
    /routes
    /middleware
```
