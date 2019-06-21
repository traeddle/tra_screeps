

export enum CreepRoles {
    Harvester = "harvester",
    Upgrader = "upgrader",
    Worker = "Worker"
}

export enum JobStatus {
    Unknown = "unknown",
    HarvestingEnergy = "harvesting energy",
    TransferingEnergy = "transfering energy",
    Upgrading = "upgrading",
    Building = "building"
}


//// memory extension samples
declare global {
    interface CreepMemory {
        role: CreepRoles;
        room: string;
        status: JobStatus;
    }
}
