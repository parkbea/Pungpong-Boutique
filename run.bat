@echo off
setlocal
cd /d "%~dp0"

echo ============================================
echo   Pungpong Boutique - AI Fashion Studio
echo ============================================
echo.

REM Install dependencies on the first run.
if not exist "node_modules" (
    echo [1/2] Installing dependencies... This may take a few minutes.
    call npm.cmd install --no-audit
    if errorlevel 1 (
        echo.
        echo Dependency installation failed. Please check that Node.js is installed.
        pause
        exit /b 1
    )
    echo.
)

echo [2/2] Starting the development server...
echo The browser will open at http://localhost:3000 shortly.
echo Press Ctrl+C in this window to stop the server.
echo.

REM Open the browser after the server has had a moment to start.
start "" /b cmd /c "timeout /t 4 >nul & start http://localhost:3000"

call npm.cmd run dev

pause
