var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')
app.use( bodyParser.json() );

app.use(express.static('dist'))

var port = process.env.PORT || 5000;

server.listen(port);

let rooms = [];

function Player(name){
  return {
    name: name,
    answers:[]
  }
};

function getRoom(code){
  code = code.toLowerCase();

  let roomsFound = rooms.filter((r) => r.code.toLowerCase() == code);

  if(roomsFound.length > 0)
    return roomsFound[0];
  else
    return null;
};

function fillInRoomQuestions(room){
    room.questions = [
      {
        Id: 1,
        Question: "How Many Dates until you Kissed?"
      },
      {
        Id: 2,
        Question: "Who does the most around the house?"
      },
      {
        Id: 3,
        Question: "Who says I love you more?"
      }
    ]
};

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/getRoomCode', function (req, res) {
  let code = Math.round((Math.pow(36, 6 + 1) - Math.random() * Math.pow(36, 6))).toString(36).slice(1);
  code = code.toLowerCase();

  rooms.push({
    code: code,
    numberOfPlayers: 0,
    players: [

    ]
  });
  res.send(code);
});

app.get('/getQuestions', function (req, res) {
  let code = req.query.room;
  let room = getRoom(code);

  res.send(room.questions);
});

app.get('/getRoom', function (req, res) {
  let code = req.query.room;
  let room = getRoom(code);

  res.send(room);
});

app.post('/joinRoom', function (req, res) {
  let code = req.body.code;
  let room = getRoom(code);

  if(room && room.numberOfPlayers < 2)
    res.send(true);
  else
    res.send(false);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log("connected");
  socket.on('joinRoom', function (code) {
    code = code.toLowerCase();
    console.log(code);
    let room = getRoom(code);

    if(room && room.numberOfPlayers < 2){
      room.numberOfPlayers++;
      socket.join(room.code);
      socket.roomCode = room.code;
      console.log('Player has Joined Room');
      if(room.numberOfPlayers== 2){
        console.log("Starting Game");
        io.sockets.in(code).emit('startGame');
      }
    }
  });

  socket.on('sendName', function (name) {
    let room = getRoom(socket.roomCode);
    if(room.players.length < 2){
      let player = Player(name);
      room.players.push(player);
      socket.player = player;
      if(room.players.length == 2){
        fillInRoomQuestions(room);
        io.sockets.in(socket.roomCode).emit('goToQuestions', socket.roomCode);
      }
    }
  });

  socket.on('sendAnswers', function (questions) {
      console.log(questions);
      let room = getRoom(socket.roomCode);
      questions.forEach( q => socket.player.answers.push({QuestionId: q.Id, Answer: q.Answer}));

      console.log(socket.player);
      let allAnswered = true;
      console.log(room.players);

      room.players.forEach( p => {
        if(p.answers.length == 0)
          allAnswered = false;
      });

      console.log(allAnswered);
      if(allAnswered)
        io.sockets.in(socket.roomCode).emit('goToAnswers', socket.roomCode);
  })
});
