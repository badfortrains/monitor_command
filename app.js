//Spawns a child process to exectue COMMAND_NAME, passing in ARGS
//as arguments.  Creates an http server and servers index.html to
//any incoming connections on port 3000.  
//
//When index.html is loaded on a browser it will establish a 
//web socket connection to the server via socket.io.  The server
//will then push any output from the executed process on stdout
//to the client for rendering.

var COMMAND_NAME = "tail",
    ARGS = ["-f", "../development.log"],
    spawn = require('child_process').spawn,
    app = require('http').createServer(handler),
    io = require('socket.io').listen(app, { log: false }),
    fs = require('fs'),
    process;


//start the process
console.log("Running "+COMMAND_NAME+" "+ARGS.join(" "))
process = spawn(COMMAND_NAME,ARGS)

//callback for when data is written to stdout
process.stdout.on('data',function(data){
  //send the data to all connected socket.io clients
  io.sockets.emit("data",""+data)
})

//log any errors from the process
process.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

//log if process ends
process.on('close', function (code) {
  console.log('child process exited with code ' + code);
});

//start the server
console.log("Server listening on port 3000")
app.listen(3000);

//server index.html for all requests
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

//Web socket client connected
io.sockets.on('connection', function (socket) {
  console.log("client connected")
});