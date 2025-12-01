# Script PowerShell pour initialiser Git et pusher sur GitHub
# Usage: .\init-git.ps1

Write-Host "🐺 Initialisation Git pour Loup-Garou Game" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est installé
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git n'est pas installé ! Télécharge-le sur https://git-scm.com" -ForegroundColor Red
    exit 1
}

# Vérifier si déjà initialisé
if (Test-Path .git) {
    Write-Host "⚠️  Git est déjà initialisé dans ce dossier" -ForegroundColor Yellow
    $continue = Read-Host "Continuer quand même ? (o/n)"
    if ($continue -ne "o") {
        exit 0
    }
}

Write-Host ""
Write-Host "📝 Configuration Git..." -ForegroundColor Green

# Demander le nom d'utilisateur GitHub
$username = Read-Host "Entre ton nom d'utilisateur GitHub"

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "❌ Nom d'utilisateur requis !" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔄 Initialisation du repository..." -ForegroundColor Green

# Initialiser Git si pas déjà fait
if (!(Test-Path .git)) {
    git init
    Write-Host "✅ Git initialisé" -ForegroundColor Green
}

# Ajouter tous les fichiers
Write-Host "📦 Ajout des fichiers..." -ForegroundColor Green
git add .

# Commit
Write-Host "💾 Création du commit..." -ForegroundColor Green
git commit -m "Initial commit - Jeu Loup-Garou complet avec animations"

# Changer la branche en main
Write-Host "🌿 Configuration de la branche main..." -ForegroundColor Green
git branch -M main

# Ajouter l'origine
$repoUrl = "https://github.com/$username/loup-garou-game.git"
Write-Host "🔗 Ajout de l'origine GitHub..." -ForegroundColor Green

# Supprimer l'ancienne origine si elle existe
git remote remove origin 2>$null

git remote add origin $repoUrl

Write-Host ""
Write-Host "✅ Configuration terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes :" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Va sur https://github.com/new" -ForegroundColor Yellow
Write-Host "2. Crée un repository nommé: loup-garou-game" -ForegroundColor Yellow
Write-Host "3. Choisis PUBLIC (obligatoire pour Render gratuit)" -ForegroundColor Yellow
Write-Host "4. Ne coche RIEN d'autre" -ForegroundColor Yellow
Write-Host "5. Clique sur 'Create repository'" -ForegroundColor Yellow
Write-Host ""
Write-Host "6. Puis reviens ici et lance:" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "7. Ensuite, suis le guide dans DEPLOIEMENT.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 URL de ton repository: $repoUrl" -ForegroundColor Cyan
