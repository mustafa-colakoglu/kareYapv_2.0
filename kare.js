var express = require("express");
var app = express();
var mongoose = require('mongoose');
var md5 = require('md5');
var sm = require("squar_modules");
/*var url = "mongodb://squar_server:325375@ds145293.mlab.com:45293/squar";
mongoose.connect(url);
var Schema = mongoose.Schema;
var userSchema = new Schema({
    id: Number,
	facebookUId : Number,
    name : String,
	uniqueName : String,
	kp : Number,
	score : Number,
	level : Number,
	roomId : Number,
	profileImageUrl : String,
	md5 : String,
    friends: [{friendId : Number}]
});
/*var CurrentAccount = mongoose.model('CurrentAccount', userSchema);
var currentAccount1 = new CurrentAccount();
currentAccount1.facebookUId = 12457;
currentAccount1.name = "Mustafa Ç2.";
currentAccount1.uniqueName = "AVC24";
currentAccount1.kp = 1000;
currentAccount1.score = 0;
currentAccount1.level = 1;
currentAccount1.roomId = 1;
currentAccount1.profileImageUrl = "https://scontent-frt3-1.xx.fbcdn.net/v/t1.0-1/c53.0.160.160/p160x160/1012701_864726226871930_6102232789075953871_n.jpg?oh=f3eec577474b2ba20b8bf25650077e7a&oe=5A22D6F9";
currentAccount1.md5 = createMd5(currentAccount1.facebookUId+currentAccount1.name+currentAccount1.uniqueName+currentAccount1.kp+currentAccount1.score);

currentAccount1.save(function (ex) {
    if (ex) {
        console.log(ex);
    } else {
        console.log("Tamam");
    }
});
*/











app.use("/js",express.static(__dirname+"/js"));
app.use("/css",express.static(__dirname+"/css"));
app.use("/pages",express.static(__dirname+"/pages"));
app.use("/files",express.static(__dirname+"/files"));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
	next();
});
var server = app.listen(process.env.PORT || 80);
var io = require("socket.io").listen(server);
io.set("origins","*:*");
io.sockets.on("connection",function(socket){
	socket.on("login",function(data){
		io.to(socket.id).emit("login",{"success":isSecure(data)});
		//console.log(doSecureData(data))
		if(isSecure(data)){
            var date = new Date();
            console.log("connected -- time : "+date.getTime());
		    data.ip = socket.handshake.address;
		    data.socketId = socket.id;
		    data.isai = false;
		    data.loginTime = date.getTime();
			sm.usersWithSocketId.insert(socket.id,data);
			sm.usersWithId.insert(data.id,data);
		}
	});
	socket.on("playForQuick",function(data){
	    if(isSecureAndIsLogin(data,socket.id)){
	        var user = sm.usersWithSocketId.get(socket.id);
	        var getNonFullTable = sm.rooms.get(user.roomId).getNonFull(undefined,user.kp);
	        if(getNonFullTable != undefined){
	            getNonFullTable.isFull = true;
	            if(getNonFullTable.usersmd5[0] == ""){
	                getNonFullTable.usersmd5[0] = user.md5;
                }
                else{
                    getNonFullTable.usersmd5[1] = user.md5;
                }
                if(!getNonFullTable.started){
	                getNonFullTable.poolKp += getNonFullTable.kp;
	                console.log(getNonFullTable.poolKp)
	                user.kp -= getNonFullTable.kp;
	                user.changedData = 2;
	                user.started = true;
	                io.to(socket.id).emit("updateData",doSecureData(user));
	                io.to(socket.id).emit("startingGame",{"table":getNonFullTable});
                }
                else{

                }
            }
        }
    });
	socket.on("getRooms",function (data) {
        if(isSecureAndIsLogin(data,socket.id)){
            io.to(socket.id).emit("getRooms",{"rooms":sm.rooms});
        }
    });
	socket.on("changeRoom",function (data) {
        if(isSecureAndIsLogin(data,socket.id)){
            var currentKp = data.kp;
            if(typeof(data.newRoomId) != "undefined"){
                if(sm.rooms.contains(data.newRoomId)){
                    var newRoom = sm.rooms.get(data.newRoomId);
                    if(newRoom.maxKp != 0){
                        if(data.kp >= newRoom.minKp & data.kp <= newRoom.maxKp){
                            data.roomId = data.newRoomId;
                            data = doSecureData(data);
                            data.error = 0;
                            data.changedData = "1"; // roomId
                        }
                        else{
                            data.error = 1;
                            data.changedData = "1"; // roomId
                        }
                    }
                    else{
                        if(data.kp >= newRoom.minKp){
                            data.roomId = data.newRoomId;
                            data = doSecureData(data);
                            data.error = 0;
                            data.changedData = "1"; // roomId
                        }
                        else{
                            data.error = 1;
                            data.changedData = "1"; // roomId
                        }
                    }
                    socket.emit("updateData",data);
                }
            }
        }
    });
	socket.on("disconnect",function () {
        if(sm.usersWithSocketId.contains(socket.id)){
            var userData = sm.usersWithSocketId.get(socket.id);
            sm.usersWithSocketId.delete(userData.socketId);
            sm.usersWithId.delete(userData.id);
        }
    });
});
app.get("/",function(req,res){
	res.sendFile(__dirname+"/pages/index.html");
});
app.get("/auth/facebook",function(req,res){});
app.get("/auth/facebook/callback",function(req,res){});
app.get("/logout",function(req,res){});

// functions
function isSecure(data){
	if(typeof(data.id) == undefined){ return false; }else{ var id = data.id+"";}
	if(typeof(data.facebookUId) == undefined){var facebookUId = "";}else{ var facebookUId = data.facebookUId+"";}
	if(typeof(data.uniqueName) == undefined){ return false; }else{ var uniqueName = data.uniqueName+"";}
	if(typeof(data.name) == undefined){ var name = "";}else{ var name = data.name+"";}
	if(typeof(data.kp) == undefined){ var kp = "";}else{ var kp = data.kp+"";}
	if(typeof(data.score) == undefined){ var score = "";}else{ var score = data.score+"";}
	if(typeof(data.roomId) == undefined){ var roomId = "";}else{ var roomId = data.roomId+"";}
	if(typeof(data.md5) == undefined){ return false; }else{ var md5 = data.md5+"";}
	var controlMd5 = createMd5(id+facebookUId+uniqueName+uniqueName+name+kp+score+roomId);
	return (controlMd5 == md5);
}
function doSecureData(data){
    if(typeof(data.id) == undefined){ return false; }else{ var id = data.id+"";}
    if(typeof(data.facebookUId) == undefined){var facebookUId = "";}else{ var facebookUId = data.facebookUId+"";}
    if(typeof(data.uniqueName) == undefined){ return false; }else{ var uniqueName = data.uniqueName+"";}
    if(typeof(data.name) == undefined){ var name = "";}else{ var name = data.name+"";}
    if(typeof(data.kp) == undefined){ var kp = "";}else{ var kp = data.kp+"";}
    if(typeof(data.score) == undefined){ var score = "";}else{ var score = data.score+"";}
    if(typeof(data.roomId) == undefined){ var roomId = "";}else{ var roomId = data.roomId+"";}
    data.md5 = createMd5(id+facebookUId+uniqueName+uniqueName+name+kp+score+roomId);
    return data;
}
function isSecureAndIsLogin(data,socketId) {
    return (isSecure(data) & sm.usersWithSocketId.contains(socketId) & sm.usersWithId.contains(data.id));
}
function createMd5(string){
	var firstMd5 = md5(string);
	var newString = "";
	for(var i=0;i<8;i++){
		newString = newString+firstMd5.charAt(i);
	}
	return md5(newString);
}
