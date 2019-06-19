import { ErrorMapper } from "utils/ErrorMapper";

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
            case ROLE_HARVESTER:
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
            case ROLE_Upgrader:
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

export const ROLE_HARVESTER = "harvester";
export const ROLE_Upgrader = "upgrader";



export class SpawnHelper {
    public static Run() {

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_HARVESTER);
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_Upgrader);


        for (const name in Game.spawns) {
            const spawn = Game.spawns[name];

            if (spawn.spawning == null) {

                if (harvesters.length < 5)
                    CreepHelper.SpawnHarvester(spawn);
                else if (upgraders.length < 2)
                    CreepHelper.SpawnUpgrader(spawn);
            }
        }
    }

    public static Spawn(spawn: StructureSpawn, body: BodyPartConstant[], opts: SpawnOptions) {
        var name = opts.memory!.role + "_" + Game.time.toString();
        var spawnReturnValue = spawn.spawnCreep(body, name, opts);
        if (spawnReturnValue != OK) {

            let val = "unknown";
            switch (spawnReturnValue) {
                case ERR_NOT_OWNER:
                    val = "ERR_NOT_OWNER";
                    break;
                case ERR_NO_PATH:
                    val = "ERR_NO_PATH";
                    break;
                case ERR_BUSY:
                    val = "ERR_BUSY";
                    break;
                case ERR_NAME_EXISTS:
                    val = "ERR_NAME_EXISTS";
                    break;
                case ERR_NOT_FOUND:
                    val = "ERR_NOT_FOUND";
                    break;
                case ERR_NOT_ENOUGH_RESOURCES:
                    val = "ERR_NOT_ENOUGH_RESOURCES";
                    break;
                case ERR_NOT_ENOUGH_ENERGY:
                    val = "ERR_NOT_ENOUGH_ENERGY";
                    break;
                case ERR_INVALID_TARGET:
                    val = "ERR_INVALID_TARGET";
                    break;
                case ERR_FULL:
                    val = "ERR_FULL";
                    break;
                case ERR_NOT_IN_RANGE:
                    val = "ERR_NOT_IN_RANGE";
                    break;
                case ERR_INVALID_ARGS:
                    val = "ERR_INVALID_ARGS";
                    break;
                case ERR_TIRED:
                    val = "ERR_TIRED";
                    break;
                case ERR_NO_BODYPART:
                    val = "ERR_NO_BODYPART";
                    break;
                case ERR_NOT_ENOUGH_EXTENSIONS:
                    val = "ERR_NOT_ENOUGH_EXTENSIONS";
                    break;
                case ERR_RCL_NOT_ENOUGH:
                    val = "ERR_RCL_NOT_ENOUGH";
                    break;
                case ERR_GCL_NOT_ENOUGH:
                    val = "ERR_GCL_NOT_ENOUGH";
                    break;
                default:

            }

            console.log("Error spawning creep: " + spawnReturnValue + ":" + val);
        }
    }
}

export class CreepHelper {
    static SpawnUpgrader(spawn: StructureSpawn) {
        SpawnHelper.Spawn(spawn, [WORK, CARRY, MOVE], CreepHelper.generateCreepSpawnOptions(ROLE_Upgrader))
    }
    static SpawnHarvester(spawn: StructureSpawn) {
        SpawnHelper.Spawn(spawn, [WORK, CARRY, MOVE], CreepHelper.generateCreepSpawnOptions(ROLE_HARVESTER))
    }

    public static generateCreepSpawnOptions(role:string): SpawnOptions {
        return {
            memory: CreepHelper.generateCreepMemory(role)
        }
    }

    public static generateCreepMemory(
        role: string
    ): CreepMemory {

        console.log(`generate creepMemory ${role}`);
        return {
            role: role,
            room: "",
            working: true
        };
    }
}
