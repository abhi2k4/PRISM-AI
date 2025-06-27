@echo off
echo Starting PRISM - Personalized Risk Intelligence Scoring Model...
echo.

echo Starting Backend Server...
cd risk_assessment_agent
start cmd /k "echo PRISM Backend Server && python main.py"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
cd ..\frontend
start cmd /k "echo PRISM Frontend Server && npm start"

echo.
echo PRISM Development Servers are starting...
echo Backend API will be available at: http://localhost:8080
echo Frontend Application will be available at: http://localhost:3000
echo API Documentation will be available at: http://localhost:8080/docs
echo.
echo Welcome to PRISM - Personalized Risk Intelligence Scoring Model!
pause
