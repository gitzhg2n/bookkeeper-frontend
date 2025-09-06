<#
PowerShell helper to run frontend install & tests inside a Node Docker image.
Usage: from repo root or frontend folder: ..\frontend\bookkeeper-frontend-1\scripts\frontend_ci.ps1
#>
param(
    [string]$NodeImage = "node:18-bullseye-slim"
)

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker CLI not found. Install Docker Desktop or install Node.js locally and run 'npm ci'."
    exit 1
}

# Convert Windows path to a form Docker can mount reliably
 $repoPath = (Get-Location).ProviderPath
 # Docker on Windows (Desktop) accepts Windows paths; replace backslashes with forward slashes for safety
 $mountPath = $repoPath -replace '\\','/'

 Write-Host "Running frontend install & tests inside Docker image: $NodeImage"

 $args = @(
     'run',
     '--rm',
     '-v',
     "$mountPath:/app",
     '-w',
     '/app',
     $NodeImage,
     'sh',
     '-c',
     "npm ci --no-audit --no-fund && npm test -- --watchAll=false"
 )

 Write-Host "docker $($args -join ' ')"

 $proc = Start-Process -FilePath 'docker' -ArgumentList $args -NoNewWindow -Wait -PassThru
if ($proc.ExitCode -ne 0) {
    Write-Error "Docker frontend script failed with exit code $($proc.ExitCode)"
    exit $proc.ExitCode
}

Write-Host "Frontend install & tests completed successfully"
