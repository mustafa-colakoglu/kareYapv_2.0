var express = require("express");
var app = express();
var mongoose = require('mongoose');
var md5 = require('md5');
var squar_modules = require("squar_modules");
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
	console.log("connected");
	socket.on("login",function(data){
		if(typeof(data.id) == undefined){ io.to(socket.id).emit("login",{"success":false}); }else{ var id = data.id+"";}
		if(typeof(data.facebookUId) == undefined){var facebookUId = "";}else{ var facebookUId = data.facebookUId+"";}
		if(typeof(data.uniqueName) == undefined){ io.to(socket.id).emit("login",{"success":false}); }else{ var uniqueName = data.uniqueName+"";}
		if(typeof(data.name) == undefined){ var name = "";}else{ var name = data.name+"";}
		if(typeof(data.kp) == undefined){ var kp = "";}else{ var kp = data.kp+"";}
		if(typeof(data.score) == undefined){ var score = "";}else{ var score = data.score+"";}
		if(typeof(data.level) == undefined){ var level = "";}else{ var level = data.level+"";}
		if(typeof(data.roomId) == undefined){ var roomId = "";}else{ var roomId = data.roomId+"";}
		if(typeof(data.md5) == undefined){ io.to(socket.id).emit("login",{"success":false}); }else{ var md5 = data.md5+"";}
		var controlMd5 = createMd5(id+facebookUId+uniqueName+uniqueName+name+kp+score+level+roomId);
		io.to(socket.id).emit("login",{"success":(md5 == controlMd5)});
	});
});
app.get("/",function(req,res){
	res.sendFile(__dirname+"/pages/index.html");
});
app.get("/auth/facebook",function(req,res){});
app.get("/auth/facebook/callback",function(req,res){});
app.get("/logout",function(req,res){});

// functions
function createMd5(string){
	var firstMd5 = md5(string);
	var newString = "";
	for(var i=0;i<8;i++){
		newString = newString+firstMd5.charAt(i);
	}
	return md5(newString);
}
