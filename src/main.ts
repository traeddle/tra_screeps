import { ErrorMapper } from "utils/ErrorMapper";
import { CreepHelper } from "helpers/CreepHelper";
import { SpawnHelper } from "helpers/SpawnHelper";
import { CreepRoles } from "helpers/constants";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
    if (Game.time % 50 == 0) {
        console.log(`blah ${Game.time}`);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////

    
    SpawnHelper.Run();

    


    for(const name in Game.creeps) {
        const creep = Game.creeps[name];

        switch (creep.memory.role) {
            case CreepRoles.HARVESTER:
                if (creep.carry.energy < creep.carryCapacity) {
                    var sources = creep.room.find(FIND_SOURCES);
                    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0]);
                    }
                }
                else {
                    if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.spawns['Spawn1']);
                    }
                }
                break;
            case CreepRoles.UPGRADER:
                if (creep.carry.energy < creep.carryCapacity) {
                    var sources = creep.room.find(FIND_SOURCES);
                    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0]);
                    }
                }
                else {
                    var controller = creep.room.controller as StructureController;
                    if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(controller);
                    }
                }
                break;
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////


    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            console.log(`delete ${name}`);
            delete Memory.creeps[name];
        }
    }

});





