var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var usuarios = {};
server.listen(3000);

app.get('/',function (req,res){
    res.sendFile(__dirname + '/public/index.html');
});

io.sockets.on('connection',function(socket){
    socket.on('novo usuario',function(nickname,callback){
        var retorno = {};
        if(nickname in usuarios){
        callback({retorno:false , msg:"O usuário já está em uso"});

        }else{
            console.log('Novo usuário no chat'+nickname);
            callback({retorno:true , msg: ""});
            socket.nickname = nickname;
            usuarios[socket.nickname] = socket;
            atualizarUsuarios();

        }
    });
    socket.on('enviar mensagem',function(data){
        var mensagem  = data.trim();
        io.sockets.emit('nova mensagem',{msg:mensagem , nick: socket.nickname});

    });
    socket.on('disconnect',function(){
        if(!socket.nickname) return;
        delete usuarios[socket.nickname];
    });
    function atualizarUsuarios(){
        io.sockets.emit('atualiza usuarios', Object.keys(usuarios));

    }
})
