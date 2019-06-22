import * as Enums from "core/Enums";


export class HarvestEnergy implements Task {
    taskType: Enums.TaskTypes;
    tickStart: number;
    target: TaskTarget;

    constructor(tickStart: number, target: TaskTarget) {
        this.taskType = Enums.TaskTypes.Harvesting;
        this.tickStart = tickStart;
        this.target = target;
    }    


    Execute(creep: Creep): Enums.TaskResult {
        let rtVal = Enums.TaskResult.InProgress;
        let havestObject = Game.getObjectById(this.target.id) as Source;

        if (havestObject === null) { return Enums.TaskResult.Invalid;}

        if (creep.harvest(havestObject) == ERR_NOT_IN_RANGE) {
            creep.moveTo(havestObject);
        }

        return (creep.carry.energy < creep.carryCapacity) ? Enums.TaskResult.InProgress : Enums.TaskResult.Complete;
    }
}

export class UpgradeController implements Task {
    taskType: Enums.TaskTypes;
    tickStart: number;
    target: TaskTarget;

    constructor(tickStart: number, target: TaskTarget) {
        this.taskType = Enums.TaskTypes.Upgrading;
        this.tickStart = tickStart;
        this.target = target;
    }

    Execute(creep: Creep): Enums.TaskResult {
        let rtVal = Enums.TaskResult.InProgress;
        let upgradeObject = Game.getObjectById(this.target.id) as StructureController;
        
        if (upgradeObject == undefined) { console.error("UpgradeController- Couldn't find Controller"); return Enums.TaskResult.Invalid; }

        let upgradeResult = creep.upgradeController(upgradeObject);
        if (upgradeResult == ERR_NOT_IN_RANGE) {
            creep.moveTo(upgradeObject);
        } else if(upgradeResult !== OK) {
            console.log("Failed upgrading controller: " + upgradeResult)
            return Enums.TaskResult.Invalid;
        } 

        return (creep.carry.energy != 0) ? Enums.TaskResult.InProgress : Enums.TaskResult.Complete;
    }
}

export class TransferEnergy implements Task {
    taskType: Enums.TaskTypes;
    tickStart: number;
    target: TaskTarget;

    constructor(tickStart: number, target: TaskTarget) {
        this.taskType = Enums.TaskTypes.TransferEnergy;
        this.tickStart = tickStart;
        this.target = target;
    }

    Execute(creep: Creep): Enums.TaskResult {
        let rtVal = Enums.TaskResult.InProgress;
        let obj = Game.getObjectById(this.target.id) as Structure | Creep;

        if (obj === null) { return Enums.TaskResult.Invalid; }

        if (creep.transfer(obj, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(obj);
        }

        return (creep.carry.energy != 0) ? Enums.TaskResult.InProgress : Enums.TaskResult.Complete;
    }

}

export class BuildStructure implements Task {
    taskType: Enums.TaskTypes;
    tickStart: number;
    target: TaskTarget;

    constructor(tickStart: number, target: TaskTarget) {
        this.taskType = Enums.TaskTypes.Building;
        this.tickStart = tickStart;
        this.target = target;
    }

    Execute(creep: Creep): Enums.TaskResult {
        let rtVal = Enums.TaskResult.InProgress;
        let obj = Game.getObjectById(this.target.id) as ConstructionSite;

        if (obj === null) { return Enums.TaskResult.Invalid; }

        if (creep.build(obj) == ERR_NOT_IN_RANGE) {
            creep.moveTo(obj);
        }

        return (creep.carry.energy != 0) ? Enums.TaskResult.InProgress : Enums.TaskResult.Complete;
    }

}
