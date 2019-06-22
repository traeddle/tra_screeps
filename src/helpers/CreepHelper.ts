import * as Enums from "core/Enums";
import { HarvestEnergy } from "tasks/HarvestEnergy";
import { TaskFactory } from "tasks/TaskFactory";
import { RoomHelper } from "helpers/RoomHelper";
import { CreepBodyDescriptor } from "core/Contracts";

export class CreepHelper {

    static generateCreepSpawnOptions(role: Enums.CreepRoles, room: Room): SpawnOptions {
        return {
            memory: CreepHelper.generateCreepMemory(role, room),
        }
    }

    static generateCreepMemory(role: Enums.CreepRoles, room: Room): CreepMemory {
    
        return {
            role: role,
            room: room.name,
            status: Enums.JobStatus.Unknown,
            task: undefined
        };
    }

    static Run() {

        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
                        

            switch (creep.memory.role) {
                case Enums.CreepRoles.Drone:
                    let task = TaskFactory.CreateTaskFromCreepMemory(creep);

                    if (task == undefined) {
                        task = RoomHelper.FindTask(creep.room, creep);
                    }
                    creep.memory.task = task;

                    if (task != undefined) {
                        let taskResult = task.Execute(creep);
                        switch (taskResult) {
                            case Enums.TaskResult.Complete:
                            case Enums.TaskResult.Invalid:
                                console.log("taskResult:1 " + taskResult);
                                creep.memory.task = undefined;
                                break;
                            case Enums.TaskResult.Pending:
                            case Enums.TaskResult.InProgress:
                                console.log("taskResult:2 " + taskResult);
                                break;
                            default:
                                console.error("Unhandled Task Result: " + taskResult);

                        }
                    } else {

                        console.log("task is undefinded");
                    }

                
                    break;

                case Enums.CreepRoles.Harvester:
                //harvest
                //deposit
                //if nowhere to deposit look for something to build
                //if nothing to build then upgrade
                    if (creep.memory.status != Enums.JobStatus.TransferingEnergy) {
                        CreepHelper.Harvest(creep, Enums.JobStatus.TransferingEnergy);
                    }
                    else {
                        CreepHelper.Transfer(creep);
                    }
                    break;
                case Enums.CreepRoles.Upgrader:
                //upgrade is the dumb one that only ever upgrades
                    if (creep.memory.status != Enums.JobStatus.Upgrading) {
                        CreepHelper.Harvest(creep, Enums.JobStatus.Upgrading);
                    }
                    else {
                        CreepHelper.Upgrade(creep);
                    }
                    break;
                case Enums.CreepRoles.Worker:
                //worker is similar to havester but will check for stuff to build before deposit
                    if (creep.memory.status != Enums.JobStatus.Building) {
                        CreepHelper.Harvest(creep, Enums.JobStatus.Building);
                    }
                    else {
                        CreepHelper.Build(creep);
                    }
                    break;
            }
        }
    }

    static Transfer(creep: Creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.energy < structure.energyCapacity;
            }
        });
        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }

        if (creep.carry.energy != 0) {
            creep.memory.status = Enums.JobStatus.TransferingEnergy;
        } else {
            creep.memory.status = Enums.JobStatus.Unknown;
        }
    }

    static Harvest(creep: Creep, nextTask: Enums.JobStatus) {
    //todo: should also look for dead creeps in vacinity and pull resources from them

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

    static Build(creep: Creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }

        if (creep.carry.energy != 0) {
            creep.memory.status = Enums.JobStatus.Building;
        } else {
            creep.memory.status = Enums.JobStatus.Unknown;
        }
    }
}

