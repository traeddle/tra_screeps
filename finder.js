/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('finder');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    findStructureForDeposit: function(creep){
        return creep.pos.findClosestByPath(FIND_STRUCTURES,{
                filter: (structure)=>{
                    return structure.my && (
                        (structure.structureType === STRUCTURE_SPAWN && structure.energyCapacity > structure.energy) ||
                       // (structure.structureType === STRUCTURE_STORAGE && structure.storeCapacity > _.sum(container.store)) ||
                        (structure.structureType === STRUCTURE_EXTENSION && structure.energyCapacity > structure.energy) ||
                        (structure.structureType === STRUCTURE_TOWER && structure.energyCapacity > structure.energy) //||
                        //(structure.structureType === STRUCTURE_CONTAINER && structure.storeCapacity > _.sum(container.store))
                        )
                }
            });
    },
    findLinkForDeposit: function(creep){
        return creep.pos.findClosestByRange(FIND_STRUCTURES,{
                filter: (structure)=>{
                    return structure.my && (
                        (structure.structureType === STRUCTURE_LINK && structure.energyCapacity > structure.energy)
                        )
                }
            });
    },
    
    findStructureForConstruction: function(creep){
        return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    },
    
    findDroppedEnergy: function(creep){
        return creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (resource)=>{
                    return (
                        (resource.resourceType === RESOURCE_ENERGY )
                        )
                }
            });
    },
    
    findSourceForHarvest: function(creep){
        return creep.pos.findClosestByPath(FIND_SOURCES,{
                    filter:(source)=>{
                        return source.energy > 0
                    }
                });
    },
    
    findSourceById: function(creep, sourceId){
        //todo: should i use the room.find instead?
        return creep.pos.findClosestByRange(FIND_SOURCES,{
                    filter:(source)=>{
                        return source.id === sourceId
                    }
                });
    },
    
    findStructureById: function(creep, sourceId){
        return creep.pos.findClosestByRange(FIND_STRUCTURES,{
                    filter:(source)=>{
                        return source.id === sourceId
                    }
                });
    }
    
    
};