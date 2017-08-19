var Android = {
	"id" : 1,
	"facebookUId" : "123456789",
	"uniqueName" : "ABC23",
	"name" : "Mustafa Çolakoğlu",
	"kp" : 100,
	"score" : 500,
	"level" : 1,
	"roomId":1,
	"profileImageUrl":"https://scontent-frt3-1.xx.fbcdn.net/v/t1.0-1/c53.0.160.160/p160x160/1012701_864726226871930_6102232789075953871_n.jpg?oh=f3eec577474b2ba20b8bf25650077e7a&oe=5A22D6F9",
	"md5" : "339cefeb08b0bafa9bf80a40107c7ae2"
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
	isLogined = false;
	socket.emit("login",Android);
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
		else if(stepId == 4){
			takeMenu(1,2);
		}
		else if(stepId == 8){
			if(isConnect()){
				takeMenu(2,undefined,13);
			}
			else{
				alertMessage("Lütfen internet bağlantınızı kontrol edin.");
			}
		}
		else if(stepId == 12){
			takeMenu(2,1);
		}
		else if(stepId == 13){
			openWaitingPage();
		}
		else if(stepId == 14){
			openGamePage(0);
		}
		else if(stepId == 15){
			openGamePage(1);
		}
		else if(stepId == 16){
			bringMenu(2,17);
		}
		else if(stepId == 17){
			alertMessage("Rakip Bulunamadı.");
		}
		else if(stepId == 18){
			closeWaitingPage();
		}
		else if(stepId== 19){
			bringMenu(2);
		}
	}
	function openWaitingPage(){
		if(isConnect()){
			$(".waiting-page").show();
			tryQuickPlayCount = 0;
			quickPlayFinded = false;
			cancelledQuickPlay = false;
			tryInterval = setInterval(function(){
				if(cancelledQuickPlay){
					tryQuickPlayCount = 0;
					clearInterval(tryInterval);
					step(19);
				}
				else if(quickPlayFinded == false){
					if(tryQuickPlayCount < 5){
						tryQuickPlayCount++;
					}
					else{
						tryQuickPlayCount = 0;
						clearInterval(tryInterval);
						closeWaitingPage();
						step(16);
					}
				}
				else{
					tryQuickPlayCount = 0;
					clearInterval(tryInterval);
					closeWaitingPage();
				}
			},1000);
		}
		else{
			alertMessage("Lütfen internet bağlantınızı kontrol edin.");
		}
	}
	function closeWaitingPage(){
		$(".waiting-page").hide();
		cancelledQuickPlay = true;
	}
	function alertMessage(message){
		$(".alert-message .message").html(message);
		$(".alert-message").css("opacity",1);
		$(".alert-message").show();
		closeAlertMessageCount = 0;
		var closeAlertMessageInterval = setInterval(function(){
			if(closeAlertMessageCount < 1){
				closeAlertMessageCount++;
			}
			else{
				closeAlertMessageCount = 0;
				clearInterval(closeAlertMessageInterval);
				$(".alert-message").animate({"opacity":0},1000,"linear",function(){
					$(this).after(function(){
						$(".alert-message").hide();
					});
				});
			}
		},1000);
	}
	function openGamePage(pageId = undefined){
		if(pageId == undefined){
			if(isConnect()){
				$(".game-page-menu-item:eq(0)").css({"color":"#ffffff","background":"#68b5f0"});
				$(".game-page-menu-item:eq(1)").css({"color":"#121212","background":"#ffffff"});
				$(".game-page-page:eq(1)").hide();
				$(".game-page-page:eq(0)").show();
			}
			else{
				$(".game-page-menu-item:eq(1)").css({"color":"#ffffff","background":"#f03236"});
				$(".game-page-menu-item:eq(0)").css({"color":"#121212","background":"#ffffff"});
				$(".game-page-page:eq(0)").hide();
				$(".game-page-page:eq(1)").show();
			}
		}
		else if(pageId == 0){
			if(isConnect()){
				$(".game-page-menu-item:eq(0)").css({"color":"#ffffff","background":"#68b5f0"});
				$(".game-page-menu-item:eq(1)").css({"color":"#121212","background":"#ffffff"});
				$(".game-page-page:eq(1)").hide();
				$(".game-page-page:eq(0)").show();
			}
			else{
				Android.Toast("İnternet bağlantınızı kontrol edin");
			}
		}
		else if(pageId == 1){
			$(".game-page-menu-item:eq(1)").css({"color":"#ffffff","background":"#f03236"});
			$(".game-page-menu-item:eq(0)").css({"color":"#121212","background":"#ffffff"});
			$(".game-page-page:eq(0)").hide();
			$(".game-page-page:eq(1)").show();
		}
	}
	function isLogin(){
		return isLogined;
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
	function bringMenu(menuId,nextStepId = undefined){
		menuId = parseInt(menuId);
		$(".menus ul").hide();
		$(".menus ul:eq("+menuId+")").show();
		$(".menus ul:eq("+menuId+") li").hide();
		var menuItemLength = $(".menus ul:eq("+menuId+") li").length;
		bringMenuItem(menuId,0,menuItemLength,nextStepId);
	}
	function bringMenuItem(menuId,count,menuItemLength,nextStepId = undefined){
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
			},150,"linear",function(){
				$(this).after(function(){
					bringMenuItem(menuId,++count,menuItemLength,nextStepId);
				});
			});
		}
		else{
			if(nextStepId != undefined){
				step(nextStepId);
			}
		}
	}
	function takeMenu(menuId,nextId = undefined,nextStepId = undefined){
		var menuItemLength = $(".menus ul:eq("+menuId+") li").length;
		takeMenuItem(menuId,--menuItemLength,menuItemLength,nextId,nextStepId);
	}
	function takeMenuItem(menuId,count,menuItemLength,nextId = undefined,nextStepId = undefined){
		if(count != -1){
			var menuItem = $(".menus ul:eq("+menuId+") li:eq("+count+")")
			if(count % 2 == 0){
				menuItem.animate({
					"left":"160%"
				},150,"linear",function(){
					$(this).after(function(){
						takeMenuItem(menuId,--count,menuItemLength,nextId,nextStepId);
					});
				});
			}
			else{
				menuItem.animate({
					"left":"-166%"
				},150,"linear",function(){
					$(this).after(function(){
						takeMenuItem(menuId,--count,menuItemLength,nextId,nextStepId);
					});
				});
			}
		}
		else{
			$(".menus ul:eq("+menuId+")").hide();
			if(nextId != undefined){
				bringMenu(nextId);
			}
			if(nextStepId != undefined){
				step(nextStepId);
			}
		}
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
	function bringGamePage(){
		$(".game-page").css({"left":"100%","display":"block"});
		$(".game-page").animate({"left":0},150);
	}
	function colorize(){
		if(isConnect()){
			$(".profile").css("color","#ffffff");
			$(".menus").css("color","#121212");
			$(".profile .onoff-line .round").css("background","green");
			$(".game-menu li").css("color","#121212");
		}
		else{
			$(".profile, .menus").css("color","#999");
			$(".menus ul:eq(0)").css("color","#121212");
			$(".game-main-menu li:eq(0), .game-main-menu li:eq(2), .game-main-menu li:eq(3), .game-main-menu li:eq(4)").css("color","#121212");
			$(".game-menu li:eq(1), .game-menu li:eq(2), .game-menu li:eq(3)").css("color","#999");
			$(".game-menu li:eq(0)").css("color","#121212");
			$(".profile .onoff-line .round").css("background","red");
		}
	}
	socket.on("connect",function(){
		colorize();
	});
	socket.on("disconnect",function(){
		colorize();
	});
	socket.on("login",function(data){
		isLogined = data.success;
	});
	socket.on("startingGame",function(data){
		quickPlayFinded = true;
	});
}