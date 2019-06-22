import * as Enums from "core/Enums";
import { HarvestEnergy, UpgradeController, TransferEnergy, BuildStructure } from "tasks/HarvestEnergy";
  
export class TaskFactory {
    static CreateTaskFromCreepMemory(creep: Creep):Task|undefined {
        if (creep.memory.task != undefined) {
            switch (creep.memory.task.taskType) {
                case Enums.TaskTypes.TransferEnergy:
                    console.log("TaskFactory- TransferEnergy");
                    return new TransferEnergy(creep.memory.task.tickStart, { id: creep.memory.task.target.id });
                case Enums.TaskTypes.Harvesting:
                    console.log("TaskFactory- Harvesting");
                    return new HarvestEnergy(creep.memory.task.tickStart, { id: creep.memory.task.target.id });
                case Enums.TaskTypes.Repairing:
                    break;
                case Enums.TaskTypes.Upgrading:
                    console.log("TaskFactory- UpgradeController");
                    return new UpgradeController(creep.memory.task.tickStart, { id: creep.memory.task.target.id });
                case Enums.TaskTypes.Building:
                    console.log("TaskFactory- BuildStructure");
                    return new BuildStructure(creep.memory.task.tickStart, { id: creep.memory.task.target.id });
                default:
                    console.log("TaskFactory- UnsupportedTask found: " + creep.memory.task.taskType);
                    break;
            }
        }
        console.log("TaskFactory- undefined");
        return undefined;
    }
}
