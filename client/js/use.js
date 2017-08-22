if(typeof(AndroidData) == "undefined"){
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
		else if(stepId == 9){
		    takeMenu(2,undefined,21);
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
			redAlertMessage("Rakip Bulunamadı.");
		}
		else if(stepId == 18){
			closeWaitingPage();
		}
		else if(stepId== 19){
			bringMenu(2);
		}
		else if(stepId == 20){
			takeMenu(0,1);
		}
		else if(stepId == 21){
		    socket.emit("getRooms",AndroidData);
        }
        else if(stepId == 22){
		    bringRooms();
        }
        else if(stepId == 23){
            takeRooms(19);
        }
	}
    function bringGamePage(){
        $(".game-page").css({"left":"100%","display":"block"});
        $(".game-page").animate({"left":0},150);
    }
    function bringMenu(menuId,nextStepId){
        menuId = parseInt(menuId);
        $(".menus ul").hide();
        $(".menus ul:eq("+menuId+")").show();
        $(".menus ul:eq("+menuId+") li").hide();
        var menuItemLength = $(".menus ul:eq("+menuId+") li").length;
        bringMenuItem(menuId,0,menuItemLength,nextStepId);
    }
    function bringMenuItem(menuId,count,menuItemLength,nextStepId){
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
    function bringProfile(){
        $(".profile").show();
        if(typeof(AndroidData.name) != "undefined"){
            $(".profile .name").html(AndroidData.name.substring(0,17));
        }
        else if(typeof(AndroidData.uniqueName) != "undefined"){
            $(".profile .name").html(AndroidData.uniqueName.substring(0,17));
        }
        $(".profile .score").html(AndroidData.score+" Puan");
        $(".profile .kp").html(AndroidData.kp+" Kp");
        $(".profile .profile-image img").attr("src",AndroidData.profileImageUrl);
        $(".profile").animate({"left":0},250);
    }
    function bringRooms(){
        $(".game-rooms").css({
            "display":"block",
            "left":"100%"
        });
        $(".game-rooms").animate({
            "left":"0px"
        },150);
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
    function closeWaitingPage(){
        cancelledQuickPlay = true;
        $(".waiting-page").animate({
            "left":"-100%"
        },150,"linear",function(){
            $(this).after(function(){
                $(".waiting-page").hide();
            });
        });
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
    function firstOpenApp(){
        $(document).ready(function(){
            var hiding = [
                ".menus ul",
                ".profile",
                ".waiting-page"
            ];
            for(var i=0; i<hiding.length;i++){
                $(hiding[i]).hide();
            }
        });
    }
    function greenAlertMessage(message){
        $(".green-alert-message .message").html(message);
        $(".green-alert-message").css("opacity",1);
        $(".green-alert-message").show();
        closeAlertMessageCount = 0;
        var closeAlertMessageInterval = setInterval(function(){
            if(closeAlertMessageCount < 1){
                closeAlertMessageCount++;
            }
            else{
                closeAlertMessageCount = 0;
                clearInterval(closeAlertMessageInterval);
                $(".green-alert-message").animate({"opacity":0},1000,"linear",function(){
                    $(this).after(function(){
                        $(".green-alert-message").hide();
                    });
                });
            }
        },1000);
    }
    function isConnect(){
        return socket.connected;
    }
    function isLogin(){
        return isLogined;
    }
    function openGamePage(pageId){
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
                //Android.Toast("İnternet bağlantınızı kontrol edin");
            }
        }
        else if(pageId == 1){
            $(".game-page-menu-item:eq(1)").css({"color":"#ffffff","background":"#f03236"});
            $(".game-page-menu-item:eq(0)").css({"color":"#121212","background":"#ffffff"});
            $(".game-page-page:eq(0)").hide();
            $(".game-page-page:eq(1)").show();
        }
    }
	function openWaitingPage(){
		if(isConnect()){
			$(".waiting-page").css({
			    "display":"block",
                "left":"100%"
            });
			$(".waiting-page").animate({"left":0},150);
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
					    socket.emit("playForQuick",AndroidData);
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
            redAlertMessage("Lütfen internet bağlantınızı kontrol edin.");
		}
	}
    function placeRooms(room){
        if(room.left != null){
            placeRooms(room.left);
        }
        var addRoom = "";
        if(AndroidData.roomId == room.value.roomId){
            addRoom = addRoom + '<li class="active">';
        }
        else {
            addRoom = addRoom + '<li>';
        }
        addRoom = addRoom + '<div class="room-name">'+room.value.roomName+'</div>';
        addRoom = addRoom + '<div class="login-room"><div class="login-room-button" onClick="selectRoom('+room.value.roomId+')">Seç</div></div>';
        $(".game-rooms ul").append(addRoom);
        if(room.right != null){
            placeRooms(room.right);
        }
        step(22);
    }
	function redAlertMessage(message){
		$(".red-alert-message .message").html(message);
		$(".red-alert-message").css("opacity",1);
		$(".red-alert-message").show();
		closeAlertMessageCount = 0;
		var closeAlertMessageInterval = setInterval(function(){
			if(closeAlertMessageCount < 1){
				closeAlertMessageCount++;
			}
			else{
				closeAlertMessageCount = 0;
				clearInterval(closeAlertMessageInterval);
				$(".red-alert-message").animate({"opacity":0},1000,"linear",function(){
					$(this).after(function(){
						$(".red-alert-message").hide();
					});
				});
			}
		},1000);
	}
    function selectRoom(roomId){
        data = AndroidData;
        data.newRoomId = parseInt(roomId);
        socket.emit("changeRoom",data);
    }
	function takeMenu(menuId,nextId,nextStepId){
		var menuItemLength = $(".menus ul:eq("+menuId+") li").length;
		takeMenuItem(menuId,--menuItemLength,menuItemLength,nextId,nextStepId);
	}
	function takeMenuItem(menuId,count,menuItemLength,nextId,nextStepId){
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
    function takeRooms(nextStepId){
            $(".game-rooms").animate({
                "left":"-100%"
            },150,"linear",function(){
                $(this).after(function(){
                    if(nextStepId != undefined) {
                        step(nextStepId);
                    }
                });
            });
    }
    function updateDatabase(data){}
	socket.on("connect",function(){
		colorize();
		socket.emit("login",AndroidData);
	});
	socket.on("disconnect",function(){
		colorize();
		isLogined = false;
	});
    socket.on("getRooms",function (data) {
        $(".game-rooms ul").html("");
        placeRooms(data.rooms._root);
    });
    socket.on("login",function(data){
        isLogined = data.success;
        if ($(".menus ul:eq(0)").css("display") === "block") {
            if(isLogin()){
                step(2);
            }
        }
    });
    socket.on("startingGame",function(data){
        quickPlayFinded = true;
        console.log(data.table);
    });
	socket.on("updateData",function (data) {
        if(typeof(data.changedData) != undefined){
            if(data.changedData == 1){
                // roomId
                if(data.error == 1){
                    redAlertMessage("Bu odaya girebilmek için gerekli Kp ye sahip değilsiniz");
                }
                else{
                    greenAlertMessage("Oda değişikliğiniz yapıldı.");
                    AndroidData = data;
                    updateDatabase(data);
                    takeRooms(23);
                }
            }
            else if(data.changedData == 2){
                AndroidData = data;
            }
            console.log(AndroidData)
        }
    });
}