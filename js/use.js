var windowWidth = $(window).width();
var windowHeight = $(window).height();
$(document).ready(function(){
	var openGameButtonWidth = (windowWidth*3/5);
	var openGameButtonHeight = (windowHeight*1/10)
	$(".open-game-button").css({
		"left":((windowWidth-openGameButtonWidth)/2)+"px",
		"top":((windowHeight-openGameButtonHeight)/2)+"px",
		"line-height":openGameButtonHeight+"px"
	});
	$(".open-game-button").click(function(){
		$(".open-game-top").animate({
			"top":-1*(windowHeight/2)+"px"
		},500);
		$(".open-game-bottom").animate({
			"top":(windowHeight)+"px"
		},500,"linear",function(){
			$(this).after(function(){
				$(".open-game-button").animate({
					"top":-1*(windowHeight/2)+"px"
				},300);
			});
		});
	});
});