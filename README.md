# Here

## Codebase

The frontend is a React (Next.js) app written in Typescript, while the backend is a REST API written in Go. We also use Firebase Authentication and Firestore.

## Set up

### Local development

1. Make sure you have Go and npm/yarn installed on your device
2. Make sure you have two secret files: `.env` and `.env.local` (see below for examples)
3. To download dependencies and start the backend service, run `make backend` from the repository root.
4. To download dependencies and launch the frontend dashboard, run `make frontend` from the repository root.

#### Secret file examples

You will can find the secrets [here](https://drive.google.com/drive/folders/1tOnm-TKXMWO8eJRhpFyfpbDcGy1ZM5r3?usp=share_link). Please contact Jenny or Tianren for access.

In the `backend/` folder, there should be a `.env` secret file with contents similar to:

```bash
# Allowed origins of requests
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
# Allowed email domains for user accounts
ALLOWED_EMAIL_DOMAINS=brown.edu,gmail.com
# Whether cross-site cookies are allowed
IS_COOKIE_CROSS_SITE=false
# The port the backend is listening from
SERVER_PORT=8080
# The Firebase config JSON string
FIREBASE_CONFIG=[REDACTED]
```

In the `frontend/` folder, there should be a `.env.local` secret file with contents similar to:

```bash
# Firebase config
NEXT_PUBLIC_API_KEY=[REDACTED]
NEXT_PUBLIC_AUTH_DOMAIN=[REDACTED]
NEXT_PUBLIC_PROJECT_ID=[REDACTED]
NEXT_PUBLIC_STORAGE_BUCKET=[REDACTED]
NEXT_PUBLIC_MESSAGING_SENDER_ID=[REDACTED]
NEXT_PUBLIC_APP_ID=[REDACTED]
NEXT_PUBLIC_MEASUREMENT_ID=[REDACTED]

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Codespace

You will need to install the GitHub Codespaces VSCode extension (Extension ID: GitHub.codespaces).

A newly created codespace works out-of-the-box. It will contain all the secrets and environment variables needed for local development. The backend is configured to listen on localhost port 8000 and the frontend will start on localhost port 3000.

### Devcontainer

1. Obtain the secret files needed for local development.
2. Make sure the docker daemon is running.
3. In VSCode, install the Dev Containers extension (Extension ID: ms-vscode-remote.remote-containers).
4. Open the repository, and execute the command "Dev Containers: Reopen in Container". Tip: you can use the CMD+Shift+P shortcut to open the command palette to quickly execute the command.

## API

For a full list of the backend APIs, visit [API documentation](./API.md).