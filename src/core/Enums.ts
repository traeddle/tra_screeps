

    export enum CreepRoles {
        Harvester = "harvester",  //todo: remove 
        Upgrader = "upgrader",//todo: remove 
        Worker = "Worker",//todo: remove 
        Drone = "Drone"//a do it all, should be able to replace harvester/upgrader and worker
    }

    export enum JobStatus {
        Unknown = "unknown",
        HarvestingEnergy = "harvesting energy",
        TransferingEnergy = "transfering energy",
        Upgrading = "upgrading",
        Building = "building"
}

export enum TaskResult {
    Pending = "pending",
    InProgress = "in progress",
    Complete = "complete",
    Invalid = "invalid"
}

export enum TaskTypes {
    Harvesting = "Harvesting",
    TransferEnergy = "TransferingEnergy",
    Upgrading = "Upgrading",
    Building = "Building",
    Repairing = "Repairing",
}


