var express = require('express');
var questions = require("./data/questions");
var Player = require("./models/player");
var app, server, port;

var env = process.env.NODE_ENV || 'development';
if(env == "development"){
  console.log("running dev");
  app = require('./build/dev-server.js');
  server = app.server;
} else {
  console.log("running prod");
  app = express();
  server = require('http').createServer(app);
  port = process.env.PORT || 5000;
  server.listen(port);
}

var io = require('socket.io')(server);

var bodyParser = require('body-parser')
app.use(bodyParser.json());

app.use(express.static('dist'))

let rooms = [];

function getRoom(code) {
	code = code.toLowerCase();

	let roomsFound = rooms.filter((r) => r.code.toLowerCase() == code);

	if (roomsFound.length > 0)
		return roomsFound[0];
	else
		return null;
};

function getRandomQuestions(numberOfQuestions){
  let questionsToAsk = [];
  let questionsAlreadyAdded = [];

  for(var i = 0; i < numberOfQuestions;){
    var index = Math.floor(Math.random() * questions.length);
    if(questionsAlreadyAdded.indexOf(index) == -1){
      questionsAlreadyAdded.push(index);
      questionsToAsk.push(questions[index]);
      i++;
    }
  }

  return questionsToAsk;
}

function fillInRoomQuestions(room) {
  let numberOfQuestions = 5;
  let questionsToAsk = getRandomQuestions(numberOfQuestions);
  room.questions = [];

	questionsToAsk.forEach(function(question, index) {
		var playerId = Math.floor(Math.random() * 2);
		let player = room.players[playerId];
		var questionPlayer1 = null;
		var questionPlayer2 = null;

		if (playerId == 0) {
			questionPlayer1 = getNonPlayerSpecificQuestion(question);
			questionPlayer2 = getPlayerSpecificQuestion(question, player.name);
		} else {
			questionPlayer2 = getNonPlayerSpecificQuestion(question);
			questionPlayer1 = getPlayerSpecificQuestion(question, player.name);
		}
		var questionDisplay = playerId == 0 ? questionPlayer1 : questionPlayer2;

		room.questions.push({
			Id: index + 1,
			Player1: questionPlayer1,
			Player2: questionPlayer2,
			Display: questionDisplay
		});
	});
};

function getPlayerSpecificQuestion(question, name) {
	var returnedQuestion =  question.replace("[PLAYER]", name);
	returnedQuestion = returnedQuestion.replace("{", "");
	returnedQuestion = returnedQuestion.replace("}", "");
	returnedQuestion = returnedQuestion.replace(/\(([^\)]+)\)/g, "");

	return returnedQuestion;
}

function getNonPlayerSpecificQuestion(question) {
	var returnedQuestion = question.replace("[PLAYER]", "");
	returnedQuestion = returnedQuestion.replace("(", "");
	returnedQuestion = returnedQuestion.replace(")", "");
	returnedQuestion = returnedQuestion.replace("{'s}", "");

	return returnedQuestion;
}

//enable cors
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/getRoomCode', function(req, res) {
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

app.get('/getQuestions', function(req, res) {
	let code = req.query.room;
	let player = req.query.player;
	let room = getRoom(code);
	var questions = [];
	room.questions.forEach(function(question) {
		console.log(question);
		console.log(player);
		questions.push({
			Id: question.Id,
			Question: question["Player" + player],
			Answer: null
		});
	});
	res.send(questions);
});

app.get('/getRoom', function(req, res) {
	let code = req.query.room;
	let room = getRoom(code);

	console.log(room);
	console.log(room.players[0]);

	res.send(room);
});

app.post('/joinRoom', function(req, res) {
	let code = req.body.code;
	let room = getRoom(code);

	if (room && room.numberOfPlayers < 2)
		res.send(true);
	else
		res.send(false);
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	console.log("connected");
	socket.on('joinRoom', function(code) {
		code = code.toLowerCase();
		console.log(code);
		let room = getRoom(code);

		if (room && room.numberOfPlayers < 2) {
			room.numberOfPlayers++;
			socket.join(room.code);
			socket.roomCode = room.code;
			console.log('Player has Joined Room');
			if (room.numberOfPlayers == 2) {
				io.sockets.in(code).emit('startGame');
			}
		}
	});

	socket.on('sendName', function(name) {
		let room = getRoom(socket.roomCode);
		if (room.players.length < 2) {
			var playerId = room.players.length + 1;
			let player = Player(playerId, name);
			room.players.push(player);
			socket.player = player;
			socket.emit("sendPlayerId", playerId);
			if (room.players.length == 2) {
				fillInRoomQuestions(room);
				io.sockets.in(socket.roomCode).emit('goToQuestions', socket.roomCode);
			}
		}
	});

  socket.on("playagain", function(){
    let room = getRoom(socket.roomCode);
    room.questions = [];

    room.players.forEach(function(p){
      p.answers = [];
    });

    fillInRoomQuestions(room);
    io.sockets.in(socket.roomCode).emit('goToQuestions', socket.roomCode);
  });

	socket.on('sendAnswers', function(questions) {
		console.log(questions);
		let room = getRoom(socket.roomCode);
		questions.forEach(q => socket.player.answers.push({
			QuestionId: q.Id,
			Answer: q.Answer
		}));

		console.log(socket.player);
		let allAnswered = true;
		console.log(room.players);

		room.players.forEach(p => {
			if (p.answers.length == 0)
				allAnswered = false;
		});

		if (allAnswered)
			io.sockets.in(socket.roomCode).emit('goToAnswers', socket.roomCode);
	})
});
