Frontend Dev Setup

This project expects Node.js (LTS) and npm available during local frontend development. Two recommended options are provided below: local Node install (via nvm for Windows) or using Docker to run the frontend commands in a container (no host Node needed).

Option A — Install Node.js locally (recommended for development)

1) Install nvm for Windows (https://github.com/coreybutler/nvm-windows):

```powershell
# open an elevated PowerShell and follow nvm-windows installer steps
# once installed, install Node LTS and use it
nvm install 18.20.0
nvm use 18.20.0
node -v
npm -v
```

2) From the frontend folder, install dependencies and run tests:

```powershell
cd .\frontend\bookkeeper-frontend-1
npm ci
npm test
npm run build
```

Option B — Use Docker (recommended if you don't want to install Node locally)

This repo includes `scripts/frontend_ci.ps1`, a PowerShell helper that runs `npm ci` and `npm test` inside an official Node Docker image.

Usage (PowerShell):

```powershell
cd .\frontend\bookkeeper-frontend-1
# run the helper script (requires Docker Desktop or similar)
..\scripts\frontend_ci.ps1
```

What the Docker script does:
- Mounts the frontend folder into a Node container
- Runs `npm ci` (install from lockfile)
- Runs `npm test` in non-interactive mode

Notes & troubleshooting
- If you see "npm: command not found" when running locally, install Node or use Docker option above.
- If Docker cannot mount the path on Windows, ensure Docker Desktop file sharing / WSL integration is enabled.
- CI should use the Docker approach (or install Node in the runner) to reproduce builds reliably.

A GitHub Actions workflow has been added to run frontend tests automatically on push and pull requests for this folder. The workflow file is located at `.github/workflows/frontend-ci.yml` inside the frontend folder.

Where to find results:
- After pushing a branch or opening a pull request, go to the repository on GitHub -> Actions -> "Frontend CI" to see the workflow runs and logs.

If you'd like, I can further customize the workflow to publish coverage, upload test artifacts, or run the build step.
