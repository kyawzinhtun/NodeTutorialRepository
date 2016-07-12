module.exports = function(io, rooms){
	var chatrooms = io.of('/roomlist').on('connection', function(socket){
		console.log('Connection Estiblished on the server !');
//To debug socket.io use this command DEBUG=socket.io* node myapp
		socket.emit('roomupdate', JSON.stringify(rooms));
		socket.on('newroom', function(data){
			rooms.push(data);
			socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
			socket.emit('roomupdate', JSON.stringify(rooms));
		})
	})
}