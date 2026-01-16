@echo off
echo Initializing Git repository for TradeSense AI project...

REM Initialize git repository
git init

REM Add all files to the repository
git add .

REM Initial commit
git commit -m "Initial commit: TradeSense AI African Prop Trading Platform"

REM Add remote origin (replace with your actual repository URL)
git remote add origin https://github.com/Fatimaezzahra2002/EXAMEN-TRADESENSE.git

REM Push to GitHub
git branch -M main
git push -u origin main

echo.
echo GitHub repository setup complete!
echo Your project has been uploaded to: https://github.com/Fatimaezzahra2002/EXAMEN-TRADESENSE
echo.
pause