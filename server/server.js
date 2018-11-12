var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Game  = require('../game/game');
var winston = require('winston');

const PORT = process.env.PORT || 3000;

const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        format: winston.format.simple()
    }),
    ]
});

const game = new Game(io, logger);

app.use(express.static('public'))
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    // register new player
    const playerId = socket.id
    game.registerNewPlayer(playerId)

    socket.on('hit', (msg) => {
        game.processHitWord(socket.id, msg.hitWord)
    })

    socket.on('disconnect', function(){
        game.unregisterPlayer(socket.id)
    });
});

http.listen(PORT, function(){
  console.log(`listening on *:${PORT}`);
});