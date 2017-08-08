var windowWidth = $(window).width();
var windowHeight = $(window).height();
var socket = io.connect("http://localhost");
firstOpenApp();
socket.on("connect",function(){
	console.log("bağlandı");
});
socket.on("disconnect",function(){
	console.log("bağlantı kesildi");
});
function firstOpenApp(){
	$(document).ready(function(){
		$(".menus ul").hide();
		var openGameButtonWidth = (windowWidth*3/5);
		var openGameButtonHeight = (windowHeight*1/10)
		$(".open-game-button").css({
			"left":((windowWidth-openGameButtonWidth)/2)+"px",
			"top":((windowHeight-openGameButtonHeight)/2)+"px",
			"line-height":openGameButtonHeight+"px"
		});
	});
}
function isConnect(){
	isConnect = false;
	socket.on("connect",function(){
		isConnect = socket.connected;
	});
	return isConnect;
}
function clickOpenGameButton(){
	$(document).ready(function(){
		$(".open-game-top").animate({
			"top":"-50%"
		},500);
		$(".open-game-bottom").animate({
			"top":"100%"
		},500,"linear",function(){
			$(this).after(function(){
				$(".open-game-button").animate({
					"top":-1*(windowHeight/2)+"px"
				},300,"linear",function(){
					$(this).after(function(){
						takeMenu(0);
					});
				});
			});
		});
	});
}
function takeMenu(menuId){
	menuId = parseInt(menuId);
	$(".menus ul").hide();
	$(".menus ul:eq("+menuId+")").show();
	$(".menus ul:eq("+menuId+") li").hide();
	var menuItemLength = $(".menus ul:eq("+menuId+") li").length;
	takeMenuItem(menuId,0,menuItemLength);
}
function takeMenuItem(menuId,count,menuItemLength){
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
					"top":(count*32+20)+"px",
					"left":"100%",
					"display":"block"
				});
			}
		}
		else{
			menuItem.css({
				"top":(count*32+20)+"px",
				"left":"-60%",
				"display":"block"
			});
		}
		menuItem.animate({
			"left":"0"
		},250,"linear",function(){
			$(this).after(function(){
				takeMenuItem(menuId,++count,menuItemLength);
			});
		});
	}
}
function connectFacebook(){
	$('.first-menu li:eq(1)').facebook_login({
		appId: '204221113443707', // your facebook application id
		endpoint: '/sessions/new',      // where to POST the response to
		onSuccess: function(data) {},   // what to do on success, usually redirect
		onError: function(data) {} ,    // what to do on error
		permissions: 'read_stream'      // what permissions you need, default is just email
	});
}