import { CreepHelper } from "helpers/CreepHelper";
import { CreepRoles } from "helpers/constants";

export class SpawnHelper {
    public static Run() {

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == CreepRoles.HARVESTER);
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == CreepRoles.UPGRADER);


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
