import * as Enums from "helpers/Enums";
import { CreepHelper } from "helpers/CreepHelper";
import { CreepBodyDescriptor } from "helpers/constants";



export class SpawnHelper {
    public static Run() {

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == Enums.CreepRoles.Harvester);
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == Enums.CreepRoles.Upgrader);
        var workers = _.filter(Game.creeps, (creep) => creep.memory.role == Enums.CreepRoles.Worker);


        for (const name in Game.spawns) {
            const spawn = Game.spawns[name];

            if (spawn.spawning == null) {

                if (harvesters.length < 5)
                    SpawnHelper.SpawnHarvester(spawn);
                else if (upgraders.length < 2)
                    SpawnHelper.SpawnUpgrader(spawn);
                else if (workers.length < 2)
                    SpawnHelper.SpawnWorker(spawn);
            }
        }
    }


    static SpawnUpgrader(spawn: StructureSpawn) {
        let creepBody: CreepBodyDescriptor = CreepBodyDescriptor.Get_Upgrader_Body();

        SpawnHelper.Spawn(spawn, SpawnHelper.CreateBiggestCreepBody(creepBody, spawn), CreepHelper.generateCreepSpawnOptions(Enums.CreepRoles.Upgrader, spawn.room))
    }
    static SpawnHarvester(spawn: StructureSpawn) {
        let creepBody: CreepBodyDescriptor = CreepBodyDescriptor.Get_Harvester_Body();

        SpawnHelper.Spawn(spawn, SpawnHelper.CreateBiggestCreepBody(creepBody, spawn), CreepHelper.generateCreepSpawnOptions(Enums.CreepRoles.Harvester, spawn.room))
    }
    static SpawnWorker(spawn: StructureSpawn) {
        let creepBody: CreepBodyDescriptor = CreepBodyDescriptor.Get_Worker_Body();

        SpawnHelper.Spawn(spawn, SpawnHelper.CreateBiggestCreepBody(creepBody, spawn), CreepHelper.generateCreepSpawnOptions(Enums.CreepRoles.Worker, spawn.room))
    }

    public static CreateBiggestCreepBody(baseBody: CreepBodyDescriptor, spawn: StructureSpawn): BodyPartConstant[] {
        let currentEnergy = spawn.energy;
        let energyCapacity = spawn.energyCapacity;
        if (energyCapacity / 2 > currentEnergy)
            return [];

        let currentCost = SpawnHelper.GetBodyCost(baseBody);
        if (currentCost > currentEnergy)
            return [];

        let multiplier = currentEnergy / currentEnergy;

        var rtVal: BodyPartConstant[] = [];

        rtVal = rtVal.concat(SpawnHelper.GetParts(baseBody.work, multiplier, WORK));
        rtVal = rtVal.concat(SpawnHelper.GetParts(baseBody.carry, multiplier, CARRY));
        rtVal = rtVal.concat(SpawnHelper.GetParts(baseBody.move, multiplier, MOVE));
        rtVal = rtVal.concat(SpawnHelper.GetParts(baseBody.attack, multiplier, ATTACK));
        rtVal = rtVal.concat(SpawnHelper.GetParts(baseBody.ranged_attack, multiplier, RANGED_ATTACK));
        rtVal = rtVal.concat(SpawnHelper.GetParts(baseBody.heal, multiplier, HEAL));
        rtVal = rtVal.concat(SpawnHelper.GetParts(baseBody.claim, multiplier, CLAIM));
        rtVal = rtVal.concat(SpawnHelper.GetParts(baseBody.tough, multiplier, TOUGH));
        return rtVal;
    }

    public static GetParts(baseNum: number, multiplier: number, bodyPart: BodyPartConstant): BodyPartConstant[]{
        if (baseNum > 0) {
            let rtVal: BodyPartConstant[] = new Array(baseNum * multiplier);
            for (var i = 0; i < baseNum * multiplier; ++i) {
                rtVal[i] = bodyPart;
            }
            return rtVal;
        }
        return [];
    }

    public static GetBodyCost(body: CreepBodyDescriptor): number {
        return body.attack * body.AttackCost
            + body.carry * body.CarryCost
            + body.claim * body.ClaimCost
            + body.heal * body.HealCost
            + body.move * body.MoveCost
            + body.ranged_attack * body.RangedAttackCost
            + body.tough * body.Tough
            + body.work * body.WorkCost
    }

    public static Spawn(spawn: StructureSpawn, body: BodyPartConstant[], opts: SpawnOptions) {
        var name = opts.memory!.role + "_" + Game.time.toString();
        if (body.length < 1) return;
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
