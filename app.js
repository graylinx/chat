var express = require('express'),
 	app 	= express(),
 	server  = require('http').createServer(app),
 	io		= require('socket.io').listen(server);
 	nicknames = [];

server.listen(3000);

//espero una peticion(req) get del cliente y le resppondo(res) documento html
app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html')
});

io.sockets.on('connection', function(socket){
	//recibe init del cliente
	socket.on('init', function(name, data){
		
		if (nicknames.indexOf(name) != -1){
			data(false);;
		}else if (name != ''){
			data(true);
			//envia writer a los clientes
			io.sockets.emit('welcome', name);
			socket.nickname = name;
			nicknames.push(socket.nickname);
		}
	});
	
	//recibimos writer del cliente
	socket.on('writer', function(data){
		//enviamos writer a los demas clientes
		io.sockets.emit('send writer', {msg: data, nick: socket.nickname});
	});

	socket.on('disconnect', function(data){
		//enviamos logout a los clientes
		nicknames.splice(nicknames.indexOf(socket.nickname), 1);
		io.sockets.emit('logout', socket.nickname);
	});


});


