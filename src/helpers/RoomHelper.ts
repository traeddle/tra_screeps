
import { HarvestEnergy, UpgradeController, TransferEnergy, BuildStructure } from "tasks/HarvestEnergy";

export class RoomHelper {
    public static FindTask(room: Room, creep: Creep): Task|undefined {

        if (creep.carry.energy == 0) {
            //easy way to even out the harvesting, could do better
            var sources = creep.room.find(FIND_SOURCES).sort(x => x.energy);
            console.log("Assigning HarvestEnergy");
            return new HarvestEnergy(Game.time, { id: sources[0].id });
        }
        
        if (room.controller !== undefined && room.controller.ticksToDowngrade < 1000) {
            console.log("Assigning UpgradeController1: " + room.controller.id);
            return new UpgradeController(Game.time, { id: room.controller.id });
        }

        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.energy < structure.energyCapacity;
            }
        });

        if (targets.length > 0) {
            console.log("Assigning TransferEnergy");
            return new TransferEnergy(Game.time, { id: targets[0].id });
        }

        //build structures
        var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (constructionSites.length > 0) {
            console.log("Assigning HarvestEnergy");
            return new BuildStructure(Game.time, { id: constructionSites[0].id });
        }

        //nothing else to do, lets upgrade :D
        if (room.controller !== undefined) {
            console.log("Assigning UpgradeController2: " + room.controller.id);
            return new UpgradeController(Game.time, { id: room.controller.id });
        }

        console.warn("No Tasks found");
        return undefined;
    }
}
