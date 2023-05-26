
const express = require('express');
const app = express();
const https = require('https');
const server = https.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const cors = require('cors');
const {spawn} = require('node:child_process');

app.use(cors());

const ffmpeg = spawn('ffmpeg', [

    '-i', '-', 
	'-c:v', 'libx264',	
    '-f', 'flv',
	'rtmp://ec2-3-110-196-1.ap-south-1.compute.amazonaws.com:8000/'
		
      ]);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('buffer',function (data) {
	    let buffer = Buffer.from(new Uint8Array(data));
        //console.log(buffer);
		ffmpeg.stdin.write(buffer);
    });
});

server.listen(5000, () => {
  console.log('listening on *:5000');
});