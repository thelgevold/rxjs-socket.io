'use strict';

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('user connected');
  socket.emit('on-join', {nick: "someone"});
  io.emit('on-join', {nick: "someone"});
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  socket.on('add-message', (message) => {
    console.log('gots message', message);
    io.emit('message', {type:'new-message', text: message});    
  });
});

http.listen(5000, () => {
  console.log('started on port 5000');
});
