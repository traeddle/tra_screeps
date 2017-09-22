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
           var roadToRepair = creep.pos.findInRange(FIND_STRUCTURES, 3, {
                filter: function(object){
                    return object.structureType === STRUCTURE_ROAD && (object.hits < object.hitsMax / 2)
                }
            });
            if(roadToRepair.length > 0){
                creep.repair(roadToRepair[0]);
            } else{  
               var target = finderMod.findStructureForDeposit(creep);
               
                if(target){
                    if(creep.transfer(target,RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                        creep.moveTo(target, settings.visualization[creep.memory.status]);
                    }
                } else {
                    setStatus(creep,"idle");
                    
                    var target = finderMod.findStructureForConstruction(creep);
               
                    if(target){
                        if(creep.build(target) === ERR_NOT_IN_RANGE){
                            creep.moveTo(target, settings.visualization[creep.memory.status]);
                        }
                    }else{
                        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller, settings.visualization[creep.memory.status]);
                        }
                    }
                }
            }
            
           
        }
       
        if(creep.memory.status === "harvesting"){
           
            if(creep.carry.energy === creep.carryCapacity){
                setStatus(creep,"delivering");
                creep.memory.delivering = true;
            } else {
                var target = finderMod.findDroppedEnergy(creep);
                if(target){
                    if(creep.pickup(target) === ERR_NOT_IN_RANGE){
                        creep.say('Get IT')
                        creep.moveTo(target,settings.visualization[creep.memory.status]);
                    }
                }else{
                    var target = finderMod.findSourceForHarvest(creep);
                   
                    if(target){
                        if(creep.harvest(target) === ERR_NOT_IN_RANGE){
                            creep.moveTo(target,settings.visualization[creep.memory.status]);
                        }
                    }
                }
               
            }
           
        }
       //creep.say(settings.status[creep.memory.status]);
    }
}