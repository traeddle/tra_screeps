require('prototype.spawn')();
var HOME_ROOM = 'W42S11';
var TARGET_ROOM = 'W41S11';

var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleHarvesterLongRange = require('role.harvester_longrange');
var roleHarvesterLink = require('role.harvester_link');
var roleUpgrader = require('role.upgrader');
var roleClaimer = require('role.claimer');
var roleLinkTransporter = require('role.link_transporter');
var roleExtensionFiller = require('role.extension_filler');
var testMod = require('test.mod');
var finderMod = require('finder');

var loopCounter = 0;
var outputFrequency = 10;

module.exports.loop = function () {
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
	
	Game.spawns.Spawn1.memory.minimumHarvesters = 6;
	Game.spawns.Spawn1.memory.minimumHarvestersLongRange = 0;
	Game.spawns.Spawn1.memory.minimumMiners = 1;
	Game.spawns.Spawn1.memory.minimumUpgraders = 0;
	
	Game.spawns.Spawn2.memory.minimumHarvesters = 0;
	Game.spawns.Spawn2.memory.minimumHarvestersLongRange = 0;
	Game.spawns.Spawn2.memory.minimumMiners = 0;
	Game.spawns.Spawn2.memory.minimumLinkTransporters = 1;
	Game.spawns.Spawn2.memory.minimumHarvestersLink = 3;
	Game.spawns.Spawn2.memory.minimumExtensionFillers = 3;
	Game.spawns.Spawn2.memory.minimumUpgraders = 3;
	Game.spawns.Spawn2.memory.storageLinkId ='59bc87498d7374404a208f8b'; //the linkId used for long term storage
	Game.spawns.Spawn2.memory.harvestLinkId ='59bc7fc1effb76361342c1ff'; //the linkId used for harvesting
	Game.spawns.Spawn2.memory.storageId = '59bcdbacc500cb64f96b582e'; //the long term storageId
	
    Game.spawns.Spawn1.spawnCreeps(TARGET_ROOM);
    Game.spawns.Spawn2.spawnCreeps();
    
    
    //move to prototype.spawn.spawnCreeps()
    //console.log(Game.rooms[TARGET_ROOM].controller.owner);
    if(Game.rooms[TARGET_ROOM] && Game.rooms[TARGET_ROOM].controller && !Game.rooms[TARGET_ROOM].controller.owner){
        var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer'); 
        if(claimers.length < 1 || (claimers.length == 1 && _.filter(claimers, (c)=>c.ticksToLive < 150))){
            var newName = Game.spawns.Spawn1.createClaimerCreep(TARGET_ROOM);
            if(!(newName < 0)){
                console.log('Spawning new claimer: ' + newName);
            }
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(!creep.memory.roomName){
            //creep.memory.roomName = HOME_ROOM;
			console.log(creep.name + ' missing roomName');
        }
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }else if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }else if(creep.memory.role == 'harvesterLongRange') {
            roleHarvesterLongRange.run(creep);
        }else if(creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }else if(creep.memory.role == 'linkTransporter') {
            roleLinkTransporter.run(creep);
        }else if(creep.memory.role == 'harvesterLink') {
            roleHarvesterLink.run(creep);
        }else if(creep.memory.role == 'extensionFiller') {
            roleExtensionFiller.run(creep);
        }else{
            console.log('Role not set or found');
            //console.log('Setting role to harvester');
            //creep.memory.role = 'harvester';
        }
    }
    
    ///*
    /*var towers = Game.rooms[HOME_ROOM].find(FIND_MY_STRUCTURES,{
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });*/
    var towers = _.filter(Game.structures, s=> s.structureType == STRUCTURE_TOWER);
    if(towers){
        for(let tower of towers){
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target != undefined){
                tower.attack(target);
            }
        }
    }
    
    var links = _.filter(Game.structures, s=> s.structureType == STRUCTURE_LINK && s.id ==Game.spawns.Spawn2.memory.harvestLinkId);
    if(links){
        for(let link of links){
            if(link.energy === link.energyCapacity){
                var storageLinks = _.filter(Game.structures, s=> s.structureType == STRUCTURE_LINK && s.id ==Game.spawns.Spawn2.memory.storageLinkId);
                link.transferEnergy(storageLinks[0])
            }
            
        }
    }
    
}