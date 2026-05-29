@echo off
echo Starting FocusedLearner...
echo.

start "Frontend" cmd /k "cd /d C:\Users\mchin\OneDrive\Desktop\focused-learner\frontend && npm run dev"

timeout /t 3

start "Backend" cmd /k "cd /d C:\Users\mchin\OneDrive\Desktop\focused-learner\backend && node server.js"

timeout /t 3

start "" "http://localhost:5173"

echo.
echo FocusedLearner is starting!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
pause