
module.exports = function(){
    StructureSpawn.prototype.spawnCreeps =
        function(targetRoom){
            if(!this.memory.loopCounter){
                this.memory.loopCounter = 0;
                this.memory.outputFrequency = 10;
            }
            
            let roomCreeps = _.filter(Game.creeps, (creep) => creep.my && creep.memory.roomName == this.room.name);
            //console.log('My creeps: ' + roomCreeps.length);
           
            this.memory.loopCounter++;
            if(this.memory.loopCounter > this.memory.outputFrequency) this.memory.loopCounter= 0;
            
            
        
        
            var harvesters = _.filter(roomCreeps, (creep) => creep.memory.role == 'harvester');    
            var miners = _.filter(roomCreeps, (creep) => creep.memory.role == 'miner');
            var harvestersLongRange = _.filter(roomCreeps, (creep) => creep.memory.role == 'harvesterLongRange');
            var harvestersLink = _.filter(roomCreeps, (creep) => creep.memory.role == 'harvesterLink');
            var upgraders = _.filter(roomCreeps, (creep) => creep.memory.role == 'upgrader');
            var linkTransporters = _.filter(roomCreeps, (creep) => creep.memory.role == 'linkTransporter');
            var extensionFillers = _.filter(roomCreeps, (creep) => creep.memory.role == 'extensionFiller');
            var energyCapacityAvailable = this.room.energyCapacityAvailable;
            if(this.memory.loopCounter == 0){
                 console.log(this.name + ' energyCapacityAvailable: ' + energyCapacityAvailable);
                 console.log(this.name + ' Harvesters: ' + harvesters.length);
                 console.log(this.name + ' Miners: ' + miners.length);
                 console.log(this.name + ' Long Range Harvesters: ' + harvestersLongRange.length);
                 console.log(this.name + ' Link Harvesters: ' + harvestersLink.length);
                 console.log(this.name + ' Upgraders: ' + upgraders.length);
                 console.log(this.name + ' Link Transporters: ' + linkTransporters.length);
                 console.log(this.name + ' Extension Fillers: ' + extensionFillers.length);
            }
            
            if(!this.spawning){
                var creepsForRenew = this.pos.findInRange(roomCreeps, 1,{
                     filter: (creep)=>
                     {
                         var bodySize = creep.body.length;
                         //return creep.my && creep.ticksToLive < 1500 - (floor(600/bodySize))
                         return creep.my && creep.ticksToLive < 1000 - (600/bodySize);
                     }
                });
                if(creepsForRenew && creepsForRenew.length > 0){
                    //for(var cIndex in creepsForRenew) {
                      //  var creep = Game.creeps[cIndex];
                        var result = this.renewCreep(creepsForRenew[0]);
                        console.log(this.name + ' Renew creep: ' + creepsForRenew[0].name + ' ' + result);
                    //}
                }
            
            }
            
            
            
            if(upgraders.length < 1) {
                var newName = this.createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'upgrader', roomName: this.room.name});
                console.log(this.name + ' Spawning new upgrader: ' + newName);
            }else if(harvesters.length < 2){
                var newName = this.createHarvesterCreep(200);
                console.log(this.name + ' Spawning new EMERGENCY harvester: ' + newName);
            }else if(harvesters.length < this.memory.minimumHarvesters){
                var newName = this.createHarvesterCreep(energyCapacityAvailable);
                if(!(newName < 0)){
                    console.log(this.name + ' Spawning new harvester: ' + newName);
                }
            }else if(harvestersLongRange.length < this.memory.minimumHarvestersLongRange){
                var newName = this.createHarvesterLongRangeCreep(energyCapacityAvailable, targetRoom);
                if(!(newName < 0)){
                    console.log(this.name + ' Spawning new long range harvester: ' + newName);
                }
            }else if(linkTransporters.length < this.memory.minimumLinkTransporters){
                //console.log('Create a damn transporter!');
                var newName = this.createLinkTransporter(energyCapacityAvailable, this.memory.storageLinkId, this.memory.storageId);
                if(!(newName < 0)){
                    console.log(this.name + ' Spawning new link transporter: ' + newName);
                }
            }else if(harvestersLink.length < this.memory.minimumHarvestersLink){
                //console.log('Create a damn link harvester!');
                var newName = this.createHarvesterLink(energyCapacityAvailable);
                if(!(newName < 0)){
                    console.log(this.name + ' Spawning new link harvester: ' + newName);
                }
            }else if(extensionFillers.length < this.memory.minimumExtensionFillers){
                var newName = this.createExtensionFiller(energyCapacityAvailable, this.memory.storageId);
                if(!(newName < 0)){
                    console.log(this.name + ' Spawning extension filler: ' + newName);
                }
            }else if(miners.length < this.memory.minimumMiners){
                var newName = this.createMinerCreep('5982fc2cb097071b4adbcf49');
                if(!(newName < 0)){
                    console.log(this.name + ' Spawning new miner: ' + newName);
                }
            }else if(upgraders.length < this.memory.minimumUpgraders) {
                var newName = this.createCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], undefined, {role: 'upgrader', roomName: this.room.name});
                console.log(this.name + ' Spawning new big upgrader: ' + newName);
            }else{
                //console.log(this.name + ' nothin: ' + this.memory.minimumLinkTransporters);
            }
        }
    
    StructureSpawn.prototype.createLinkTransporter =
        function(energy, linkId, storageId){
            
            var body = [];
                body.push(CARRY);
                body.push(CARRY);
                body.push(MOVE);
            return this.createCreep(body, undefined, {role:'linkTransporter', roomName: this.room.name, targetLinkId: linkId, targetStorageId: storageId });
        }
        
    StructureSpawn.prototype.createExtensionFiller =
        function(energy, storageId){
            
            var body = [];
                body.push(CARRY);
                body.push(CARRY);
                body.push(CARRY);
                body.push(CARRY);
                body.push(CARRY);
                body.push(CARRY);
                body.push(CARRY);
                body.push(CARRY);
                body.push(MOVE);
                body.push(MOVE);
                body.push(WORK);
                body.push(WORK);
            return this.createCreep(body, undefined, {role:'extensionFiller', roomName: this.room.name, targetStorageId: storageId });
        }
        
    StructureSpawn.prototype.createHarvesterLink =
        function(energy){
            //console.log('createHarvesterLink ')
            var numberOfParts = Math.floor((energy - 300)/200);
            var body = [];
            for(let i = 0; i < numberOfParts; i++){
                body.push(WORK);
            }
            for(let i = 0; i < numberOfParts; i++){
                body.push(CARRY);
            }
            for(let i = 0; i < numberOfParts; i++){
                body.push(MOVE);
            }
            
            return this.createCreep(body, undefined, {role:'harvesterLink', roomName: this.room.name});
        }
    StructureSpawn.prototype.createHarvesterCreep =
        function(energy){
            var numberOfParts = Math.floor(energy/200);
            var body = [];
            for(let i = 0; i < numberOfParts; i++){
                body.push(WORK);
            }
            for(let i = 0; i < numberOfParts; i++){
                body.push(CARRY);
            }
            for(let i = 0; i < numberOfParts; i++){
                body.push(MOVE);
            }
            
            return this.createCreep(body, undefined, {role:'harvester', roomName: this.room.name});
        }
    StructureSpawn.prototype.createMinerCreep  =
        function(target){
            return this.createCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role:'miner', targetSource: target, roomName: this.room.name});
        }
    StructureSpawn.prototype.createHarvesterLongRangeCreep =
        function(energy, target){
            var numberOfParts = Math.floor(energy/600);
            var body = [];
            for(let i = 0; i < numberOfParts; i++){
               // body.push(TOUGH);
                //body.push(TOUGH);
            }
            for(let i = 0; i < numberOfParts; i++){
                body.push(WORK);
            }
            for(let i = 0; i < numberOfParts; i++){
                body.push(CARRY);
                body.push(CARRY);
                body.push(CARRY);
                body.push(CARRY);
                body.push(CARRY);
            }
            for(let i = 0; i < numberOfParts; i++){
                body.push(MOVE);
                body.push(MOVE);
                body.push(MOVE);
                body.push(MOVE);
                body.push(MOVE);
            }
            for(let i = 0; i < numberOfParts; i++){
                //body.push(ATTACK);
            }
            
            return this.createCreep(body, undefined, {role:'harvesterLongRange', homeRoom: this.room.name, targetRoom: target, roomName: this.room.name});
        }
    StructureSpawn.prototype.createClaimerCreep =
        function (target) {
            return this.createCreep([CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'claimer', targetRoom: target, roomName: this.room.name });
        };
};