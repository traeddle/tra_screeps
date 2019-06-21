import * as Enums from "helpers/Enums";
import { SpawnHelper } from "helpers/SpawnHelper";

export class CreepHelper {
    static SpawnUpgrader(spawn: StructureSpawn) {
        let creepBody: CreepBodyDescriptor = new CreepBodyDescriptor()
        creepBody.work = 1;
        creepBody.carry = 1;
        creepBody.move = 1;
        
        SpawnHelper.Spawn(spawn, SpawnHelper.CreateBiggestCreepBody(creepBody, spawn), CreepHelper.generateCreepSpawnOptions(Enums.CreepRoles.Upgrader, spawn.room))
    }
    static SpawnHarvester(spawn: StructureSpawn) {
        let creepBody: CreepBodyDescriptor = new CreepBodyDescriptor()
        creepBody.work = 1;
        creepBody.carry = 1;
        creepBody.move = 1;   
        SpawnHelper.Spawn(spawn, SpawnHelper.CreateBiggestCreepBody(creepBody, spawn), CreepHelper.generateCreepSpawnOptions(Enums.CreepRoles.Harvester, spawn.room))
    }

    public static generateCreepSpawnOptions(role: Enums.CreepRoles, room: Room): SpawnOptions {
        return {
            memory: CreepHelper.generateCreepMemory(role, room)
        }
    }

    public static generateCreepMemory(role: Enums.CreepRoles, room: Room): CreepMemory {
    
        return {
            role: role,
            room: room.name,
            working: true,
            status: Enums.JobStatus.Unknown
        };
    }

    public static Run() {

        for (const name in Game.creeps) {
            const creep = Game.creeps[name];

            switch (creep.memory.role) {
                case Enums.CreepRoles.Harvester:
                    if (creep.memory.status != Enums.JobStatus.TransferingEnergy) {
                        CreepHelper.Harvest(creep, Enums.JobStatus.TransferingEnergy);
                    }
                    else {
                        CreepHelper.Transfer(creep);
                    }
                    break;
                case Enums.CreepRoles.Upgrader:
                    if (creep.memory.status != Enums.JobStatus.Upgrading) {
                        CreepHelper.Harvest(creep, Enums.JobStatus.Upgrading);
                    }
                    else {
                        CreepHelper.Upgrade(creep);
                    }
                    break;
            }
        }
    }

    static Transfer(creep: Creep) {
        if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.spawns['Spawn1']);
        }
        if (creep.carry.energy != 0) {
            creep.memory.status = Enums.JobStatus.TransferingEnergy;
        } else {
            creep.memory.status = Enums.JobStatus.Unknown;
        }
    }

    static Harvest(creep: Creep, nextTask: Enums.JobStatus) {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }

        if (creep.carry.energy < creep.carryCapacity) {
            creep.memory.status = Enums.JobStatus.HarvestingEnergy;
        } else {
            creep.memory.status = nextTask;
        }
    }

    static Upgrade(creep: Creep) {
        var controller = creep.room.controller as StructureController;
        if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controller);
        }
        if (creep.carry.energy != 0) {
            creep.memory.status = Enums.JobStatus.Upgrading;
        } else {
            creep.memory.status = Enums.JobStatus.Unknown;
        }
    }
}

//used to store and create creep
export class CreepBodyDescriptor {
    move: number = 0;
    work: number = 0;
    carry: number = 0;
    tough: number = 0;
    attack: number = 0;
    ranged_attack: number = 0;
    heal: number = 0;
    claim: number = 0;

    readonly MoveCost:number = 50;
    readonly WorkCost: number =  100;
    readonly CarryCost: number =  50;
    readonly AttackCost: number =  80;
    readonly RangedAttackCost: number =  150;
    readonly HealCost: number =  250;
    readonly ClaimCost: number =  600;
    readonly Tough: number =  10;
}
