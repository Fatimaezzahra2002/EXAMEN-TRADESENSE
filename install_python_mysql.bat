@echo off
echo Installation de Python et configuration de MySQL pour TradeSense AI
echo ================================================================

echo.
echo Verification de la presence de Python...
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python est deja installe
) else (
    echo Python n'est pas installe sur ce systeme.
    echo Veuillez telecharger et installer Python depuis le Microsoft Store ou depuis python.org
    echo Apres l'installation, veuillez relancer ce script.
    pause
    exit /b 1
)

echo.
echo Verification de la presence de pip...
pip --version >nul 2>&1
if %errorlevel% == 0 (
    echo pip est disponible
) else (
    echo pip n'est pas disponible. Veuillez verifier votre installation de Python.
    pause
    exit /b 1
)

echo.
echo Verification de la presence de MySQL...
where mysql >nul 2>&1
if %errorlevel% == 0 (
    echo MySQL CLI est disponible
) else (
    echo MySQL CLI n'est pas trouve dans le PATH.
    echo Veuillez vous assurer que MySQL est installe et que le chemin vers mysql.exe est dans votre PATH.
    echo Le chemin typique est : C:\Program Files\MySQL\MySQL Server 8.0\bin
    echo Pour ajouter MySQL au PATH :
    echo 1. Allez dans System Properties > Advanced > Environment Variables
    echo 2. Ajoutez le chemin ci-dessus a la variable PATH
    echo 3. Redemarrez votre terminal
    pause
    exit /b 1
)

echo.
echo Installation des dependances Python...
cd /d "%~dp0\backend"
if not exist requirements.txt (
    echo Le fichier requirements.txt n'existe pas dans le dossier backend
    pause
    exit /b 1
)

pip install -r requirements.txt
if %errorlevel% == 0 (
    echo Les dependances ont ete installees avec succes
) else (
    echo Erreur lors de l'installation des dependances
    pause
    exit /b 1
)

echo.
echo Verification de la connexion a MySQL...
echo Veuillez entrer vos identifiants MySQL :
set /p MYSQL_USER="Nom d'utilisateur MySQL (defaut=root): "
if "%MYSQL_USER%"=="" set MYSQL_USER=root

set /p MYSQL_PASSWORD="Mot de passe MySQL: "

echo SHOW DATABASES; | mysql -u %MYSQL_USER% -p%MYSQL_PASSWORD% >nul 2>&1
if %errorlevel% == 0 (
    echo Connexion a MySQL reussie
) else (
    echo Echec de la connexion a MySQL
    echo Veuillez verifier vos identifiants et la configuration de MySQL
    pause
    exit /b 1
)

echo.
echo Creation de la base de donnees 'examen'...
echo CREATE DATABASE IF NOT EXISTS examen; | mysql -u %MYSQL_USER% -p%MYSQL_PASSWORD%
if %errorlevel% == 0 (
    echo Base de donnees 'examen' creee ou existe deja
) else (
    echo Erreur lors de la creation de la base de donnees
    pause
    exit /b 1
)

echo.
echo Configuration terminee avec succes!
echo Vous pouvez maintenant demarrer le serveur backend avec la commande:
echo cd backend && python app.py
echo.
echo Et ensuite demarrer le frontend avec:
echo npm run dev
echo.
pause