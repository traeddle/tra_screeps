

export enum CreepRoles {
    Harvester = "harvester",
    Upgrader = "upgrader"
}

export enum JobStatus {
    Unknown = "unknown",
    HarvestingEnergy = "harvesting energy",
    TransferingEnergy = "transfering energy",
    Upgrading = "upgrading"
}


//// memory extension samples
declare global {
    interface CreepMemory {
        role: CreepRoles;
        room: string;
        working: boolean;
        status: JobStatus;
    }
}
