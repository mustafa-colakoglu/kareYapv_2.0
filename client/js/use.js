var Android = {
	"uniqueId" : 1,
	"facebookUId" : "123456789",
	"uniqueName" : "ABC23",
	"name" : "Mustafa Çolakoğlu",
	"kp" : 100,
	"score" : 500,
	"level" : 1,
	"roomId":1,
	"profileImageUrl":"https://scontent-frt3-1.xx.fbcdn.net/v/t1.0-1/c53.0.160.160/p160x160/1012701_864726226871930_6102232789075953871_n.jpg?oh=f3eec577474b2ba20b8bf25650077e7a&oe=5A22D6F9",
	"md5" : "123456789"
}
if(typeof(Android) == "undefined"){
	alert("Lütfen uygulamadan giriş yapın");
	$(document).ready(function(){
		$("html").html("");
	});
}
else{
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var socket = io.connect("http://localhost");
	step(0);
	function step(stepId){
		if(stepId == 0){
			firstOpenApp();
			step(1);
		}
		else if(stepId == 1){
			clickOpenGameButton();
		}
		else if(stepId == 2){
			bringMenu(1);
			bringProfile();
			colorize();
		}
		else if(stepId == 3){
			bringMenu(0);
		}
	}
	function isLogin(){
		if(typeof(Android.facebookUId) != "undefined"){
			if(Android.facebookUId != ""){
				return true;
			}
			return false;
		}
		else if(typeof(Android.uniqueName) != "undefined"){
			if(Android.uniqueName != ""){
				return true;
			}
			return false;
		}
		return false;
	}
	function firstOpenApp(){
		$(document).ready(function(){
			$(".menus ul").hide();
		});
	}
	function isConnect(){
		return socket.connected;
	}
	function clickOpenGameButton(){
		$(document).ready(function(){
			$(".open-game-top").animate({
				"top":"0%"
			},750,"linear",function(){
				$(this).after(function(){
					$(".open-game-top").animate({
						"top":"-50%"
					},375);
					$(".open-game-bottom").animate({
						"top":"100%"
					},375,"linear",function(){
						$(this).after(function(){
							if(isLogin()){
								step(2);
							}
							else{
								step(3);
							}
						});
					});
				});
			});
		});
	}
	function bringMenu(menuId){
		menuId = parseInt(menuId);
		$(".menus ul").hide();
		$(".menus ul:eq("+menuId+")").show();
		$(".menus ul:eq("+menuId+") li").hide();
		var menuItemLength = $(".menus ul:eq("+menuId+") li").length;
		bringMenuItem(menuId,0,menuItemLength);
	}
	function bringMenuItem(menuId,count,menuItemLength){
		if(count != menuItemLength){
			var menuItem = $(".menus ul:eq("+menuId+") li:eq("+count+")")
			if(count % 2 == 0){
				if(count == 0){
					menuItem.css({
						"top":"0",
						"left":"100%",
						"display":"block"
					});
				}
				else{
					menuItem.css({
						"top":(count*52)+"px",
						"left":"100%",
						"display":"block"
					});
				}
			}
			else{
				menuItem.css({
					"top":(count*52)+"px",
					"left":"-60%",
					"display":"block"
				});
			}
			menuItem.animate({
				"left":"0"
			},250,"linear",function(){
				$(this).after(function(){
					bringMenuItem(menuId,++count,menuItemLength);
				});
			});
		}
	}
	function takeMenu(menuId){
		$(".menus ul:eq("+menuId+")").hide();
	}
	function takeMenuItem(menuId,count,menuItemLength){
		
	}
	function bringProfile(){
		if(typeof(Android.name) != "undefined"){
			$(".profile .name").html(Android.name.substring(0,17));
		}
		else if(typeof(Android.uniqueName) != "undefined"){
			$(".profile .name").html(Android.uniqueName.substring(0,17));
		}
		$(".profile .score").html(Android.score+" Puan");
		$(".profile .kp").html(Android.kp+" Kp");
		$(".profile .profile-image img").attr("src",Android.profileImageUrl);
		$(".profile").animate({"left":0},250);
	}
	function colorize(){
		if(isConnect()){
			$(".profile").css("color","#ffffff");
			$(".menus").css("color","#121212");
			$(".profile .onoff-line .round").css("background","green");
		}
		else{
			$(".profile, .menus").css("color","#999");
			$(".game-menu li:eq(0), .game-menu li:eq(5), .game-menu li:eq(6), .game-menu li:eq(7)").css("color","#121212");
			$(".profile .onoff-line .round").css("background","red");
		}
	}
	socket.on("connect",function(){
		colorize();
	});
	socket.on("disconnect",function(){
		colorize();
	});
}