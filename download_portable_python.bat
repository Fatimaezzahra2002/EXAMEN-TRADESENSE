@echo off
echo Telechargement et configuration de Python Portable
echo ===============================================

echo.
echo Creation du dossier python-portable...
mkdir python-portable 2>nul
cd python-portable

echo.
echo Telechargement de Python 3.11.6 Portable...
powershell -Command "Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.6/python-3.11.6-embed-amd64.zip' -OutFile 'python-portable.zip'"

echo.
echo Extraction de Python Portable...
powershell -Command "Expand-Archive -Path 'python-portable.zip' -DestinationPath '.' -Force"

echo.
echo Nettoyage des fichiers temporaires...
del python-portable.zip

echo.
echo Configuration de pip...
powershell -Command "Invoke-WebRequest -Uri 'https://bootstrap.pypa.io/get-pip.py' -OutFile 'get-pip.py'"
python.exe get-pip.py

echo.
echo Installation des dependances...
cd ..
copy backend\requirements.txt python-portable\
cd python-portable
python.exe -m pip install -r requirements.txt

echo.
echo Python Portable configure avec succes !
echo Le chemin complet est : %cd%\python.exe
echo.
echo Pour demarrer le backend, utilisez :
echo %cd%\python.exe ..\backend\app.py
echo.
pause