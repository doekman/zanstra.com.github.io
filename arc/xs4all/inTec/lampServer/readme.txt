HTTP Server in VB6
As a test-project I made lampServer. It's a very simple web-server in VB, based on the winsock-control. It uses a request- and response-object, implemented in javascript/xml-com-wrapper. 

Error: Address in use
Problem: You are already running a webserver (probably IIS of PWs). 
Solution 1: Stop IIS with the command "net stop iisadmin /y" (start it again with "net start w3svc".
Solution 2: To use another port, change the constant cintPort in the VB code and compile again.

Error: ActiveX component can't create object
Problem: the WSC components haven't been registered. 
Solution: Run setup.bat

source: http://www.xs4all.nl/~zanstra/inTec/http.htm


Update 2021-11-29:

* Link is now <https://zanstra.com/arc/xs4all/inTec/http.htm>
* zipped `.exe` files, because GitHub Pages
* Added index-file
