require('dotenv').config() 

const http    = require('http');
const fs      = require('fs');

const log = require('@ajar/marker')

const {API_PORT,API_HOST} = process.env;

const server = http.createServer((req,res)=> {
        //log the request url
       log.d('req.url: ',req.url);

       res.setHeader('Content-Type', 'text/html');
       fs.createReadStream(__dirname + '/public-chat-client.html').pipe(res);
});

const io = require('socket.io').listen(server);

io.sockets.on('connection', socket => {

  log.debug('client connected ');
  
  socket.emit('server-msg', { message: 'welcome to the chat' });

  socket.on('client-msg',  data => {
    log.obj(data,'client says: ');
    io.sockets.emit('server-msg', data);
  });
});

//start the server
(async ()=> {
  await server.listen(API_PORT,API_HOST);
  log.magenta(`server is live on`,`  ✨ ⚡  http://${API_HOST}:${API_PORT} ✨ ⚡`);  
})().catch(error=> log.error(error))