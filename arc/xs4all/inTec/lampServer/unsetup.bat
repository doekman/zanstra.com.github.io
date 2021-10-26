@echo off
cls
echo Setting down lampServer
echo.
echo - De-registring component httpRequest.wsc
regsvr32.exe /u /s httpRequest.wsc
if errorlevel 1 echo ! Error de-registering httpRequest.wsc

echo - De-registring component httpResponse.wsc
regsvr32.exe /u /s httpResponse.wsc
if errorlevel 1 echo ! Error de-registering httpResponse.wsc

echo.
echo Done. 