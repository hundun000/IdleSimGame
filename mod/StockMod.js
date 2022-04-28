class StockMod extends BaseMod {

    constructor() {
        super()
        this.titleTextContent = "A股模拟器";
        this.attributeTextContent = "本游戏纯属虚构，如有雷同，纯属巧合。";
        
        this.dictionary={
            NAME: "职业",
            MONEY: "现金",
            HOLD_SZ_AMOUNT: "深证500指数持仓",
            HOLD_SH_AMOUNT: "上证500指数持仓",
            SZ_POINT: "深圳500指数值",
            SH_POINT: "上证500指数值"
        }



        let role1 = {};
        role1[this.#PlayerStatusNormalType.NAME] = "散户";
        role1[this.#PlayerStatusNormalType.MONEY] = 2000;
        this.player_class_list.push(role1);


        this.starter_extend_player_status[this.#PlayerStatusStockType.HOLD_SZ_AMOUNT]= 0;
        this.starter_extend_player_status[this.#PlayerStatusStockType.HOLD_SH_AMOUNT]= 0;

        this.starter_extend_world_status[this.#WorldStatusType.SZ_POINT]= 1000;
        this.starter_extend_world_status[this.#WorldStatusType.SH_POINT]= 1000;


    }

    #StockFlagType=Object.freeze({TRADE: "trade"});
    #StockNpcType=Object.freeze({GROUP_OWNER: "炒股交流群群主", GROUP_ADMIN: "炒股交流群管理员"});

    #PlayerStatusStockType=Object.freeze({
        HOLD_SZ_AMOUNT: "HOLD_SZ_AMOUNT", 
        HOLD_SH_AMOUNT: "HOLD_SH_AMOUNT",
    });
    #WorldStatusType=Object.freeze({
        SZ_POINT: "SZ_POINT", 
        SH_POINT: "SH_POINT",
    });
    #PlayerStatusNormalType=Object.freeze({
        NAME: "NAME", 
        MONEY: "MONEY",
    });


    event_init() {
        let modRef = this;

        global_world_rules.events["开户"]={
            apply:function(){
                if(global_current_base_player_status.myclass.name=="散户"){
                    show("你为了锻炼自己成为了一名冒险者。")
                    show("作为一名散户，痛苦会给你带来力量——但也会带来快感。")
                    gainbuff("无惧疼痛")
                }
                pause()
                show("炒股交流群群主是一个三十岁出头的高大女性，她欢迎了你的加入并提醒你要保护好自己。")
                gainop(modRef.#StockNpcType.GROUP_OWNER)
                show("炒股交流群管理员是一个满身伤痕的魁梧男人，你被他观察你的眼光弄得有些不自在。")
                gainop(modRef.#StockNpcType.GROUP_ADMIN)
                gainflag(modRef.#StockFlagType.TRADE,60)
            },
            townCondition:true,
            once:true,
            chance:function(){
                return MAX_CHANCE_WEIGHT
            }
        };

        
        let buySZ = {
            buyAmount: 100,
            apply:function(){
                show("你打算今天买入深证500指数，当前指数值为：" + global_current_extend_world_status[modRef.#WorldStatusType.SZ_POINT])
                let gainMap = {};
                gainMap[modRef.#PlayerStatusStockType.HOLD_SZ_AMOUNT] = buySZ.buyAmount
                gainMap[modRef.#PlayerStatusNormalType.MONEY] = -buySZ.buyAmount
                gain(gainMap)
            },
            townCondition:true,
            chance:function(){
                if (global_current_extend_player_status[modRef.#PlayerStatusNormalType.MONEY] > buySZ.buyAmount) {
                    return global_current_extend_player_status[modRef.#PlayerStatusNormalType.MONEY] / buySZ.buyAmount
                } else {
                    return 0;
                }
                    
            }
        }
        global_world_rules.events["买入深证500指数"]= buySZ;

        let buySH = {
            buyAmount: 100,
            apply:function(){
                show("你打算今天买入上证500指数，当前指数值为：" + global_current_extend_world_status[modRef.#WorldStatusType.SH_POINT])
                let gainMap = {};
                gainMap[modRef.#PlayerStatusStockType.HOLD_SH_AMOUNT] = buySH.buyAmount
                gainMap[modRef.#PlayerStatusNormalType.MONEY] = -buySH.buyAmount
                gain(gainMap)
            },
            townCondition:false,
            chance:function(){
                if (global_current_extend_player_status[modRef.#PlayerStatusNormalType.MONEY] > buySH.buyAmount) {
                    return global_current_extend_player_status[modRef.#PlayerStatusNormalType.MONEY] / buySH.buyAmount
                } else {
                    return 0;
                }
                    
            }
        }
        global_world_rules.events["买入上证500指数"]= buySH;

        let work = {
            baseSalary: 50,
            chanceThreshold: 500,
            apply:function(){
                show("你感觉自己钱不多了，所以决定去打工。")
                let salary = work.baseSalary + randFloorInt(work.baseSalary * 0.5);
                show("今天打工赚了" + salary + "元。")
                let gainMap = {};
                gainMap[modRef.#PlayerStatusNormalType.MONEY] = salary
                gain(gainMap)
            },
            townCondition:true,
            chance:function(){
                if (global_current_extend_player_status[modRef.#PlayerStatusNormalType.MONEY] > work.chanceThreshold) {
                    return 0
                } else {
                    let delta = work.chanceThreshold - global_current_extend_player_status[modRef.#PlayerStatusNormalType.MONEY];
                    return delta / work.baseSalary;
                }
            }
        }
        global_world_rules.events["打工"]= work;

        let doNothingOutTown = {
            apply:function(){
                show("你今天在城镇外无所事事。")
            },
            townCondition:false,
            chance:function(){
                return 5
            }
        }
        global_world_rules.events["城镇外无所事事"]= doNothingOutTown;

        let doNothingInTown = {
            apply:function(){
                show("你今天在城镇内无所事事。")
            },
            townCondition:false,
            chance:function(){
                return 5
            }
        }
        global_world_rules.events["城镇内无所事事"]= doNothingInTown;
    }

    calculateUiAttributeText() {
        let att_str=""
        if(global_current_base_world_status.chapter==6) {
            att_str="市场等级 S "
        } else {
            att_str="市场等级 "+String.fromCharCode(70-global_current_base_world_status.chapter)+" "
        }
        
        for(const typeValue of Object.values(this.#PlayerStatusNormalType)){
            att_str+=global_current_mod.dictionary[typeValue]+" "+global_current_extend_player_status[typeValue]+"   "
        }
        return att_str;
    }

    calculateUiStatusText() {
        let att_str=""
        for(const typeValue of Object.values(this.#PlayerStatusStockType)){
            if(global_current_extend_player_status[typeValue]!=0 && global_current_extend_player_status[typeValue]!="") {
                att_str+=global_current_mod.dictionary[typeValue]+" "+global_current_extend_player_status[typeValue]+"<br>"
            }
            if(global_current_extend_player_status[typeValue]==="") {
                att_str+=global_current_mod.dictionary[typeValue]+" 无<br>"
            }
        }
        att_str+="<br>"
        for(i in global_current_base_player_status.buffs){
            if(global_current_base_player_status.buffs[i]==0) {
                att_str+=i+"<br>"
            } else {
                att_str+=i+" "+global_current_base_player_status.buffs[i]+"<br>"
            }
        }
        att_str+="<br>"
        for(i in global_current_base_player_status.affinityMap){
            if(global_current_base_player_status.affinityMap[i].val>=0) {
                att_str+=i+"好感度 "+global_current_base_player_status.affinityMap[i].val+"<br>"
            }
        }
        return att_str;
    }


}


