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
        if(creep.carry.energy === creep.carryCapacity){
            var targetStorage = finderMod.findStructureById(creep, creep.memory.targetStorageId);
            var t = creep.transfer(targetStorage, RESOURCE_ENERGY)
            //console.log('transfer energy: ' + t);
            if(t == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetStorage);
            }
        }
        else{
            var targetLink = finderMod.findStructureById(creep, creep.memory.targetLinkId);
            //console.log('withdraw energy');
            if(creep.withdraw(targetLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetLink);
            }
        }
    }
}