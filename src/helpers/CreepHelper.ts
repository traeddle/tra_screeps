import { SpawnHelper } from "helpers/SpawnHelper";
import { CreepRoles } from "helpers/constants";

export class CreepHelper {
    static SpawnUpgrader(spawn: StructureSpawn) {
        SpawnHelper.Spawn(spawn, [WORK, CARRY, MOVE], CreepHelper.generateCreepSpawnOptions(CreepRoles.UPGRADER))
    }
    static SpawnHarvester(spawn: StructureSpawn) {
        SpawnHelper.Spawn(spawn, [WORK, CARRY, MOVE], CreepHelper.generateCreepSpawnOptions(CreepRoles.HARVESTER))
    }

    public static generateCreepSpawnOptions(role: string): SpawnOptions {
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
