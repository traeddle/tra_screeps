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
       
        
       
        
       
        if(creep.memory.status === "harvesting"){
           
            var target = finderMod.findSourceById(creep, creep.memory.targetSource);
           
            if(target){
                if(creep.harvest(target) === ERR_NOT_IN_RANGE){
                    creep.moveTo(target,settings.visualization[creep.memory.status]);
                }
            }
           
        }
       //creep.say(settings.status[creep.memory.status]);
    }
}