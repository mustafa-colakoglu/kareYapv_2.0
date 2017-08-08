var express = require("express");
var app = express();
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
	socket.on("merhaba",function(data){
		console.log(data);
	});
});
app.get("/",function(req,res){
	res.sendFile(__dirname+"/pages/index.html");
});
app.get("/auth/facebook",function(req,res){});
app.get("/auth/facebook/callback",function(req,res){});
app.get("/logout",function(req,res){});