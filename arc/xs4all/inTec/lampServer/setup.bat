@echo off
cls
echo Setting up lampServer
echo.
echo - Registring component httpRequest.wsc
regsvr32.exe /s httpRequest.wsc
if errorlevel 1 echo ! Error registering httpRequest.wsc

echo - Registring component httpResponse.wsc
regsvr32.exe /s httpResponse.wsc
if errorlevel 1 echo ! Error registering httpResponse.wsc

echo Done. 