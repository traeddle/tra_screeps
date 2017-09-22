var finderMod = require('finder');
var settings = {
    renew:[400,1200],
    status:{
        renewing:"♻ RENEW",
        harvesting:"⛏ HARVEST",
        delivering:"🛢 DELIVER",
        idle:"🛏 IDLE"
    },
    visualization:{
        "harvest": {visualizePathStyle: {stroke: '#ff0000'}},
        "idle": {visualizePathStyle: {stroke: '#ffff00'}},
        "deliver": {visualizePathStyle: {stroke: '#00ff00'}},
        "renew": {visualizePathStyle: {stroke: '#ff00ff'}}
    }
}
 
function setStatus(creep,status){
    if(creep.memory.status !== status){
        creep.memory.status = status;
        creep.say(settings.status[status]);
    }
}
module.exports = {
    run: function(creep){
       
        if(!creep.memory.status){
            creep.memory.status = "harvesting";
        }
       
        if(creep.memory.renew && creep.ticksToLive < settings.renew[0]){
            setStatus(creep,"renew");
            var target = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            if(target){
                creep.moveTo(target.pos, settings.visualization[creep.memory.status]);
            }
            if(creep.pos.isNearTo(target.pos)){
                if(creep.carry.energy > 0){
                    creep.transfer(target.pos,RESOURCE_ENERGY)
                }
            }
        }
       
        if(creep.memory.status === "renew" && creep.ticksToLive < settings.renew[1]){
            return;
        } else if(creep.memory.status === "renew" && creep.ticksToLive >= settings.renew[1]){
           
            if(creep.memory.delivering){
                setStatus(creep, "delivering");
            } else {
                setStatus(creep, "harvesting");
            }
        }
       
        if(creep.carry.energy === 0){
            creep.memory.delivering = false;
        }
       
        if(!creep.memory.delivering){
            setStatus(creep,"harvesting");
        }
       
        if((creep.memory.status === "delivering" || creep.memory.status === "idle" || (!creep.memory.renew && creep.memory.status === "renew")) && creep.memory.delivering){
           if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
       
        if(creep.memory.status === "harvesting"){
           
            if(creep.carry.energy === creep.carryCapacity){
                setStatus(creep,"delivering");
                creep.memory.delivering = true;
            } else {
                var target = creep.pos.findClosestByPath(FIND_SOURCES,{
                    filter:(source)=>{
                        return source.energy > 0
                    }
                });
               
                if(target){
                    if(creep.harvest(target) === ERR_NOT_IN_RANGE){
                        creep.moveTo(target,settings.visualization[creep.memory.status]);
                    }
                }
            }
        }
    }
}