

const global_current_mod = new StockMod();

function load(){
	modLoad()
	global_current_base_world_status.gameover=true
}

let modLoad=function() {
	global_current_mod.event_init()

    document.getElementById('htmlId_title').innerHTML = global_current_mod.titleTextContent;
    document.getElementById('htmlId_attribute').innerHTML = global_current_mod.attributeTextContent;
}



function getbuff(str){
	if(global_current_base_player_status.buffs[str]==null) {
		return -1
	}
	return global_current_base_player_status.buffs[str]
}

function getAffinity(str){
	if(global_current_base_player_status.affinityMap[str]==null) {
		return -1
	}
	return global_current_base_player_status.affinityMap[str].val
}

function getflag(str){
	if(global_current_base_player_status.flags[str]==null) {
		return -1
	}
	return global_current_base_player_status.flags[str]
}
const global_ui_status={
	log_txt: "",
	display_text_buffer: "",
	display_texts: [],
}
const global_world_rules={
	events: {},
	event_ids: [],
}
const global_current_base_world_status={

	gameover: false,
	town: false,
	monthend: false,
	chapter: -1,
	current_chapter_startweek: -1,
	week: -1,
	month: -1,
	gamestate: "stop",
	past_event: null,
}
const global_current_base_player_status={
	myclass: null,
	buffs: {},
	op: null,
	flags: [],
}
const global_current_extend_player_status={}
const global_current_extend_world_status={}

function refresh(){

	
	
	
	// fommat events and init event_ids
	for(i in global_world_rules.events){
		global_world_rules.event_ids.push(i)
		if(global_world_rules.events[i].startChapterCondition==null) {
			global_world_rules.events[i].start=0
		}
		if(global_world_rules.events[i].endChapterCondition==null) {
			global_world_rules.events[i].end=MAX_CHAPTER_CONDITION
		}
		if(global_world_rules.events[i].once==null) {
			global_world_rules.events[i].once=false
		}
	}
	// starter set to current
	for(i in global_current_mod.starter_extend_player_status) {
		global_current_extend_player_status[i]=global_current_mod.starter_extend_player_status[i]
	}
	for(i in global_current_mod.starter_extend_world_status) {
		global_current_extend_world_status[i]=global_current_mod.starter_extend_world_status[i]
	}
	// playerClass modify current
	global_current_base_player_status.myclass=global_current_mod.player_class_list[randFloorInt(global_current_mod.player_class_list.length)]
	for(i in global_current_base_player_status.myclass){
		global_current_extend_player_status[i]=global_current_base_player_status.myclass[i]
	}
	
	// reset global

	global_current_base_player_status.buffs={}
	global_current_base_player_status.flags={}
	global_current_base_player_status.affinityMap={}

	global_current_base_world_status.chapter=1
	global_current_base_world_status.current_chapter_startweek=0
	global_current_base_world_status.past_event=[]
	global_current_base_world_status.week=1
	global_current_base_world_status.month=1
	global_current_base_world_status.town=true
	global_current_base_world_status.monthend=false
	global_current_base_world_status.gameover=false

	global_ui_status.log_txt=""
	global_ui_status.display_texts=[]
	global_ui_status.display_text_buffer=""
}

function show(str,newline){
	if(newline==false){
		global_ui_status.display_text_buffer+=str+" "
		return
	}
	global_ui_status.display_text_buffer+=str+"<br>"
	if(newline==true){
		global_ui_status.display_texts.push(global_ui_status.display_text_buffer)
		global_ui_status.display_text_buffer=""
	}
}

function pause(){
	global_ui_status.display_texts.push(global_ui_status.display_text_buffer)
	global_ui_status.display_text_buffer=""
}

function mainLoop(){

	if(global_ui_status.display_texts.length>0||global_ui_status.display_text_buffer!=""){
		if(global_ui_status.display_text_buffer!=""){
			global_ui_status.display_texts.push(global_ui_status.display_text_buffer)
			global_ui_status.display_text_buffer=""
		}
		global_ui_status.log_txt+=global_ui_status.display_texts.shift()
		document.getElementById("htmlId_gamelog").innerHTML=global_ui_status.log_txt
		if(global_ui_status.display_texts.length==0 || (!global_current_base_world_status.town && global_current_base_world_status.week==1)){
			global_ui_status.log_txt+="<br>"
			document.getElementById("htmlId_gamelog").innerHTML=global_ui_status.log_txt

			document.getElementById("htmlId_attribute").innerHTML=att_str= global_current_mod.calculateUiAttributeText();
			document.getElementById("htmlId_status").innerHTML= global_current_mod.calculateUiStatusText();
		}
		let myDiv = document.getElementById("bottom-right");
		myDiv.scrollTop = myDiv.scrollHeight;
		return
	}
	if(global_current_base_world_status.gamestate=="step2"){
		if(my_int!=null) {
			clearInterval(my_int)
		}
		global_current_base_world_status.gamestate="stop"
		return
	}else if(global_current_base_world_status.gamestate=="step"){
		global_current_base_world_status.gamestate="step2"
	}
	if(global_current_base_world_status.gameover==true){
		if(my_int!=null) {
			clearInterval(my_int)
		}
		global_current_base_world_status.gamestate="stop"
		return
	}


	

	if(global_current_base_world_status.monthend==true){
		show("月底")

		global_current_mod.handleMonthEndBusiness()

		
		global_current_base_world_status.month++
		global_current_base_world_status.monthend=false
		global_current_base_world_status.week++
		mainLoop()
		global_current_base_world_status.town=true

		return
	}else{
		if(global_current_base_world_status.town) {
			show("第"+global_current_base_world_status.week+"周 城镇事件")
		} else {
			show("第"+global_current_base_world_status.week+"周 冒险事件")
		}
		
		global_current_mod.handleWeekBusiness()

		let usingEventId = getRandomEventId();
		console.log("usingEventId = " + usingEventId);
		global_world_rules.events[usingEventId].apply()
		if(!global_current_base_world_status.past_event.includes(usingEventId)) {
			global_current_base_world_status.past_event.push(usingEventId);
			console.log("past_event added");
		}

		if(global_current_base_world_status.week%4==0 && global_current_base_world_status.monthend==false && !global_current_base_world_status.town) {
			global_current_base_world_status.monthend=true
		} else {
			if(global_current_base_world_status.town) {
				global_current_base_world_status.town=false
			} else {
				global_current_base_world_status.week++
				global_current_base_world_status.monthend=false
				global_current_base_world_status.town=true
			}
		}
		mainLoop()
		return
	}
}
const MAX_CHAPTER_CONDITION = 1000;
const MAX_CHANCE_WEIGHT = 100000;
const BIG_CHANCE_WEIGHT = 10000;
const MAX_BUFF_NUM = 10000;
const MAX_OP_NUM = 10000;
const MIN_BUFF_NUM = -10000;
let getRandomEventId = function() {

	let chanceRangeList=[]
	let sumChanceLength=0
	console.log("getRandomEventId for town = ",global_current_base_world_status.town, ", chapter = ", global_current_base_world_status.chapter)
	for(i in global_world_rules.event_ids){
		try{
			let tryingEventId = global_world_rules.event_ids[i];
			let tryingEvent = global_world_rules.events[tryingEventId];
			let condition1 = tryingEvent.townCondition==global_current_base_world_status.town;
			let condition2 = !tryingEvent.startChapterCondition || tryingEvent.startChapterCondition<=global_current_base_world_status.chapter 
			let condition3 = !tryingEvent.endChapterCondition || tryingEvent.endChapterCondition>=global_current_base_world_status.chapter
			let condition4 = (tryingEvent.once!=true || !(global_current_base_world_status.past_event.includes(tryingEventId)))

			//console.log("event_id = %s condition match: ",tryingEventId, condition1, condition2, condition3, condition4)

			if(condition1&&condition2&&condition3&&condition4){
				let thisEventChanceLength=tryingEvent.chance()
				//console.log("thisEventChanceLength of " + tryingEventId + " = " + thisEventChanceLength)
				if(thisEventChanceLength!=null) {
					sumChanceLength += thisEventChanceLength
				}	
			}
		} catch(err){
			//console.log("event_id = " + tryingEventId + " getRandomEventId error: " + err.message)
			throw err
		}
		chanceRangeList[i]=sumChanceLength
	}
	if (sumChanceLength == 0) {
		throw ("sumChanceLength = 0, maybe something wrong")
	} else {
		console.log("sumChanceLength = ", sumChanceLength)
	}
	let usingT = sumChanceLength*Math.random()

	let usingEventIndex=0
	while(usingT>chanceRangeList[usingEventIndex] && chanceRangeList[usingEventIndex]<MAX_CHANCE_WEIGHT){
		usingEventIndex++;
	}

	return global_world_rules.event_ids[usingEventIndex];

} 

function gainop(person){
	if(global_current_base_player_status.affinityMap[person]==null){
		global_current_base_player_status.affinityMap[person]={
			val:0,
			st:"",
			prison:0
		}
		show("你认识了"+person)
	}else{
		global_current_base_player_status.affinityMap[person].val+=1
		show(person+"的好感度提升了")
	}
}

function gainbuff(newbuff,val){
	if(val==null && global_current_base_player_status.buffs.newbuff==null){
		global_current_base_player_status.buffs[newbuff]=0
		show("获得状态 "+newbuff)
	}
	else if(val<0){
		global_current_base_player_status.buffs[newbuff]+=val
		if(global_current_base_player_status.buffs[newbuff]<=0){
			delete(global_current_base_player_status.buffs[newbuff])
			show("状态解除 "+newbuff)
		}else{
			show("状态减轻 "+newbuff+" "+val)
		}
	}else{
	
		if(global_current_base_player_status.buffs[newbuff]==null){
			global_current_base_player_status.buffs[newbuff]=val
			show("获得状态 "+newbuff+" "+val)
		}else {
			global_current_base_player_status.buffs[newbuff]+=val	
			show("状态强化 "+newbuff+" "+val)
		}
	}
}


function gainflag(newbuff,val){
	if(val==null && global_current_base_player_status.flags[newbuff]==null){
		global_current_base_player_status.flags[newbuff]=0
	}
	else if(val<0){
		global_current_base_player_status.flags[newbuff]+=val
		if(global_current_base_player_status.flags[newbuff]<=0){
			delete(global_current_base_player_status.flags[newbuff])
		}
	}else{
		if(global_current_base_player_status.flags[newbuff]==null){
			global_current_base_player_status.flags[newbuff]=val
		}else {
			global_current_base_player_status.flags[newbuff]+=val	
		}
	}
}

let summaryBonus = function(bonusMap) {
	let stringbuilder=""
	for(s in global_current_mod.dictionary){
		if(s in bonusMap){
			global_current_extend_player_status[s]+=bonusMap[s]
			if(Number.isInteger(bonusMap[s])&&bonusMap[s]>0){
				stringbuilder+=global_current_mod.dictionary[s]+"+"+bonusMap[s]+"  "
			}else if(bonusMap[s]<0){
				stringbuilder+=global_current_mod.dictionary[s]+bonusMap[s]+"  "
			}
		}
	}
	return stringbuilder;
}

function gain(bonusMap,enemy){
	
	
	// 1. 现有的bonus通过某种规则计算一个Counter，计算结果可能导致bonus内容改变。并返回这个Counter供后续流程读取。
	let customCounter = global_current_mod.handleGainBonusEventModifyBonus(bonusMap,enemy)

	let summaryResult = summaryBonus(bonusMap);
	show(summaryResult);

	// 现有的bonus和customCounter通过某种规则，可能再次出发gain
	global_current_mod.handleGainEventMoreBusiness(bonusMap, customCounter)

}



function randFloorInt(n){
	return Math.floor(Math.random()*n)
}