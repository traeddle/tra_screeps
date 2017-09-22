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
        if(creep.room.name == creep.memory.targetRoom){
            //creep.say('Claim')
            var target = creep.claimController(creep.room.controller);
            //console.log('Claim target: ' + target);
            if(target == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller);
                //creep.momove(RIGHT);
            }else if(target == ERR_GCL_NOT_ENOUGH){
                creep.say('reserveController')
                target = creep.reserveController(creep.room.controller);
                if(target == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller);
                }
            }
        }else{
            //creep.say('exit');
            var b = creep.room.findExitTo(creep.memory.targetRoom);
            creep.moveTo(creep.pos.findClosestByPath(b));
        }
    }
}