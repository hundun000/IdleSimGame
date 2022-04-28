class BaseMod {
    titleTextContent = null;
    attributeTextContent = null;
    dictionary = {};
	player_class_list = [];
	starter_extend_player_status = {};
	starter_extend_world_status = {};
	starter_base_player_status = {};
	event_init() {} // abstract

	calculateUiAttributeText() { return ""} // abstract
	calculateUiStatusText() { return ""} // abstract
	handleWeekBusiness() {}// abstract
	handleMonthEndBusiness() {} // abstract
	handleGainBonusEventModifyBonus(bonusMap,enemy) { return {}} // abstract
	handleGainEventMoreBusiness(bonusMap, customCounter){} // abstract
	
}