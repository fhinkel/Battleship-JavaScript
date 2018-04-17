const express = require('express');

const path = require('path')

const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')))

app.get('/hello', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

io.on('connection', function(socket){
    console.log('a user connected');
});


// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});