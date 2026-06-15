@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo   뿡뽕의상실 - AI 여성복 디자인 스튜디오
echo ============================================
echo.

REM 의존성이 설치되어 있지 않으면 자동 설치
if not exist "node_modules" (
    echo [1/2] 의존성 설치 중... ^(처음 한 번만 실행됩니다^)
    call npm install
    if errorlevel 1 (
        echo.
        echo 의존성 설치에 실패했습니다. Node.js가 설치되어 있는지 확인하세요.
        pause
        exit /b 1
    )
    echo.
)

echo [2/2] 개발 서버를 시작합니다...
echo 잠시 후 브라우저가 http://localhost:3000 으로 열립니다.
echo 종료하려면 이 창에서 Ctrl+C 를 누르세요.
echo.

REM 서버가 뜰 시간을 준 뒤 브라우저 열기
start "" /b cmd /c "timeout /t 4 >nul & start http://localhost:3000"

call npm run dev

pause
