# WSGT BOT

Wind Shadow Gaming Technology (WSGT) BOT - all-in-one Discord management bot for Shadowplay RP.

## Setup (Beginner Friendly)

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+
- A Discord Bot Application (https://discord.com/developers/applications)

### 2. Install dependencies
```
npm install
```

### 3. Configure environment
Copy `.env.example` to `.env` and fill in values:
```
cp .env.example .env
```

### 4. Database
Create a PostgreSQL database, then run migrations:
```
npm run migrate
```

### 5. Register slash commands
```
npm run deploy
```

### 6. Start bot
```
npm start
```

### Discord Developer Portal
- Create application, add Bot, enable Privileged Gateway Intents: Server Members, Message Content, Presence.
- OAuth2 scopes: bot, applications.commands. Permissions: Administrator (or custom).
- Copy token to DISCORD_TOKEN, client id to CLIENT_ID, client secret to DISCORD_CLIENT_SECRET.

### Dashboard
Runs on DASHBOARD_PORT (default 3000). Configure OAuth2 redirect URL to DASHBOARD_CALLBACK_URL.

### Music
Optional Lavalink. Set LAVALINK_* env vars. Music commands require a running Lavalink node; if not configured, music commands will error gracefully.

### Backups
```
npm run backup
```

### Troubleshooting
- "Missing Access": check bot permissions and role hierarchy.
- DB connection errors: verify DATABASE_URL and that Postgres is running.
- Commands not appearing: run `npm run deploy` and wait up to 1 hour for global commands.

## Project Structure
See /src folders. Modular commands, events, services, database.

## License
MIT
