function newgame(){
	refresh();
	if(my_int!=null)clearInterval(my_int)
	my_int=setInterval(mainLoop,1000);
	global_current_base_world_status.gamestate="auto"
}

let my_int=null

function pause_btn(){
	if(global_current_base_world_status.gameover==true)return
	if(my_int!=null)clearInterval(my_int)
	global_current_base_world_status.gamestate="stop"
}
function step_btn(){
	if(global_current_base_world_status.gameover==true)return
	if(my_int!=null)clearInterval(my_int)
	my_int=setInterval(mainLoop,200);
	global_current_base_world_status.gamestate="step"
}
function auto_btn(){
	if(global_current_base_world_status.gameover==true){
		refresh();
		if(my_int!=null)clearInterval(my_int)
		my_int=setInterval(mainLoop,1000);
		global_current_base_world_status.gamestate="auto"
	}
	if(my_int!=null)clearInterval(my_int)
	my_int=setInterval(mainLoop,1000);
	global_current_base_world_status.gamestate="auto"
}
function fast_btn(){
	if(global_current_base_world_status.gameover==true){
		refresh();
		if(my_int!=null)clearInterval(my_int)
		my_int=setInterval(mainLoop,200);
		global_current_base_world_status.gamestate="auto"
	}
	if(my_int!=null)clearInterval(my_int)
	my_int=setInterval(mainLoop,200);
	global_current_base_world_status.gamestate="auto"
}
