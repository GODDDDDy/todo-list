#Requires -Version 5.1
<#
.SYNOPSIS
  Push the todo-list project to GitHub: auto-create remote repo, commit, and push.
.DESCRIPTION
  Auth: Uses built-in Git Credential Manager (GCM). `git credential fill` triggers
  an Edge browser GitHub OAuth login (reusing the already-logged-in session) to
  obtain a token. Then:
    1. Create the remote repo via GitHub REST API
    2. Stage and commit local files
    3. Add remote and push
  Includes error handling and retries.
.PARAMETER RepoName
  Remote repository name. Default: todo-list
.PARAMETER Private
  Switch: create a private repo. Omit for public.
.PARAMETER Description
  Repository description.
#>
[CmdletBinding()]
param(
    [string]$RepoName = "todo-list",
    [switch]$Private,
    [string]$Description = "A modern Todo List app built with React 19 + TypeScript + Vite + Tailwind + shadcn/ui"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

# -- helpers --
function Write-Step { param([string]$msg) Write-Host ""; Write-Host "[*] $msg" -ForegroundColor Cyan }
function Write-Ok   { param([string]$msg) Write-Host "  [OK] $msg" -ForegroundColor Green }
function Write-Warn2 { param([string]$msg) Write-Host "  [!]  $msg" -ForegroundColor Yellow }
function Write-Err  { param([string]$msg) Write-Host "  [X]  $msg" -ForegroundColor Red }
function Die        { param([string]$msg); Write-Err $msg; exit 1 }

# -- preflight --
Write-Step "Environment check"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot
Write-Ok "Project root: $projectRoot"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Die "git not found. Install Git for Windows first." }
$gitVer = (git --version) 2>&1
Write-Ok "Git: $gitVer"

if (-not (Test-Path ".git")) {
    Write-Warn2 "No .git detected, initializing..."
    git init -b main
    if ($LASTEXITCODE -ne 0) { Die "git init failed." }
    Write-Ok "Initialized git repo (branch: main)"
}

$name  = git config user.name
$email = git config user.email
if (-not $name)  { git config user.name  "GODDDDDy"; $name = "GODDDDDy" }
if (-not $email) { git config user.email "GODDDDDy@users.noreply.github.com"; $email = "GODDDDDy@users.noreply.github.com" }
Write-Ok "Commit identity: $name ($email)"

git config credential.helper manager
$gcm = (git credential-manager --version) 2>&1
if ($LASTEXITCODE -eq 0) { Write-Ok "GCM: $gcm" } else { Write-Warn2 "GCM not available, may need manual credentials." }

# -- obtain GitHub token via GCM (Edge browser) --
Write-Step "Obtaining GitHub credentials (via Edge browser / GCM)"

# Use temp file + cmd redirection for reliable stdin to git credential fill
$tmpCred = [System.IO.Path]::GetTempFileName()
[System.IO.File]::WriteAllText($tmpCred, "protocol=https`nhost=github.com`n`n", [System.Text.Encoding]::ASCII)
$credRaw = & cmd /c "git credential fill < `"$tmpCred`" 2>&1"
Remove-Item $tmpCred -ErrorAction SilentlyContinue

if (-not $credRaw -or $credRaw -match "fatal:") {
    Write-Warn2 "Credential fill failed."
    Write-Host "  Complete the authorization in the Edge window, then re-run this script."
    Die "Could not obtain GitHub credentials."
}

$username = $null
$token    = $null
$credText = $credRaw -join "`n"
foreach ($line in $credText -split "`n") {
    if ($line -match "^username=(.+)$") { $username = $Matches[1].Trim() }
    if ($line -match "^password=(.+)$") { $token    = $Matches[1].Trim() }
}

if (-not $token) {
    Die "Failed to extract GitHub token from GCM. Make sure Edge is logged in to GitHub."
}
Write-Ok "Got GitHub credentials (user: $username)"

# -- validate token + get real login --
Write-Step "Validating token and fetching account info"

$headers = @{
    "Authorization" = "Bearer $token"
    "Accept"        = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
    "User-Agent"    = "todo-list-push-script"
}

try {
    $me = Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $headers -Method Get -ErrorAction Stop
    Write-Ok "Authenticated user: $($me.login)"
    $ghUser = $me.login
} catch {
    Die "Token validation failed: $($_.Exception.Message)"
}

# -- create remote repo via GitHub REST API --
$visLabel = if ($Private) { "private" } else { "public" }
Write-Step "Creating remote repo: $RepoName ($visLabel)"

$payload = @{
    name        = $RepoName
    description = $Description
    private     = $Private.IsPresent
    auto_init   = $false
} | ConvertTo-Json -Compress

$repoUrl = $null
try {
    $resp = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Headers $headers -Method Post -Body $payload -ContentType "application/json" -ErrorAction Stop
    $repoUrl = $resp.html_url
    Write-Ok "Repo created: $repoUrl"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 422) {
        Write-Warn2 "Repo $RepoName may already exist, will use it directly."
        $repoUrl = "https://github.com/$ghUser/$RepoName"
    } else {
        Die "Failed to create repo: $($_.Exception.Message)"
    }
}

$remoteUrl = "https://github.com/$ghUser/$RepoName.git"

# -- stage and commit --
Write-Step "Staging files and creating initial commit"

$status = git status --porcelain 2>&1
if (-not $status) {
    Write-Warn2 "No changes to commit, skipping."
} else {
    git add -A
    if ($LASTEXITCODE -ne 0) { Die "git add failed." }
    Write-Ok "Staged all files"

    $commitMsg = "feat: initial commit - React 19 + TypeScript + Vite + Tailwind + shadcn/ui Todo List"
    git commit -m $commitMsg 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) { Die "git commit failed." }
    Write-Ok "Created commit"
}

# -- add remote and push --
Write-Step "Configuring remote and pushing"

$existingRemote = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    git remote remove origin
    Write-Warn2 "Removed existing origin remote"
}

git remote add origin $remoteUrl
if ($LASTEXITCODE -ne 0) { Die "git remote add failed." }
Write-Ok "Added remote: $remoteUrl"

# push with retries
$maxRetries = 3
$pushed = $false
for ($i = 1; $i -le $maxRetries; $i++) {
    Write-Host "  Push attempt $i of $maxRetries ..." -ForegroundColor DarkGray
    git push -u origin main 2>&1 | Out-Host
    if ($LASTEXITCODE -eq 0) {
        $pushed = $true
        break
    }
    Write-Warn2 "Push failed (attempt $i), retrying in 3s..."
    Start-Sleep -Seconds 3
}

if (-not $pushed) { Die "Push failed after $maxRetries attempts. Check network/permissions." }
Write-Ok "Push succeeded!"

# -- done --
Write-Step "All done"
Write-Host ""
Write-Host "  Repo URL:  " -NoNewline; Write-Host $repoUrl -ForegroundColor White
Write-Host "  Branch:    main -> origin/main"
Write-Host ""
Write-Host "  To update later:" -ForegroundColor DarkGray
Write-Host '    git add -A; git commit -m "your message"; git push' -ForegroundColor DarkGray
Write-Host ""
