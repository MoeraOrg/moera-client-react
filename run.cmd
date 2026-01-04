@echo off

if exist .ssl (
    set HTTPS=true
    for %%f in (.ssl\*.pem) do (
        echo %%f | findstr /C:"-key.pem" >nul
        if not errorlevel 1 (
            set SSL_KEY_FILE=%%~ff
        ) else (
            set SSL_CRT_FILE=%%~ff
        )
    )
)

set PORT=3000
yarn start
