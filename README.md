monitor_command
===============


Spawns a child process to exectue COMMAND_NAME, passing in ARGS
as arguments.  Creates an http server and servers index.html to
any incoming connections on port 3000.  

When index.html is loaded on a browser it will establish a 
web socket connection to the server via socket.io.  The server
will then push any output from the executed process on stdout
to the client for rendering.

Requires node.js:
Install dependencies: ````npm install````
run: ````node app.js````
