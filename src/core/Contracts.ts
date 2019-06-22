import * as Enums from "core/Enums";

//// memory extension samples
declare global {
    interface CreepMemory {
        role: Enums.CreepRoles;
        status: Enums.JobStatus;
        room: string;
        task?: Task;
    }

    interface Task {
        tickStart: number,
        target: TaskTarget,
        taskType: Enums.TaskTypes
        //parent: Task,
        //subTasks: Task[]

        Execute(creep: Creep) : Enums.TaskResult
    }

    interface TaskTarget {
        id: string,
        location?: SerializablePos
    }

    interface SerializablePos {
        x: number;
        y: number;
        roomName: string;
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

        readonly MoveCost: number = 50;
        readonly WorkCost: number = 100;
        readonly CarryCost: number = 50;
        readonly AttackCost: number = 80;
        readonly RangedAttackCost: number = 150;
        readonly HealCost: number = 250;
        readonly ClaimCost: number = 600;
        readonly Tough: number = 10;

        static Get_Drone_Body(): CreepBodyDescriptor {
            let creepBody: CreepBodyDescriptor = new CreepBodyDescriptor()
            creepBody.work = 2;
            creepBody.carry = 1;
            creepBody.move = 1;
            return creepBody;
        }
        static Get_Harvester_Body(): CreepBodyDescriptor {
            let creepBody: CreepBodyDescriptor = new CreepBodyDescriptor()
            creepBody.work = 2;
            creepBody.carry = 1;
            creepBody.move = 1;
            return creepBody;
        }
        static Get_Upgrader_Body(): CreepBodyDescriptor {
            let creepBody: CreepBodyDescriptor = new CreepBodyDescriptor()
            creepBody.work = 2;
            creepBody.carry = 1;
            creepBody.move = 1;
            return creepBody;
        }
        static Get_Worker_Body(): CreepBodyDescriptor {
            let creepBody: CreepBodyDescriptor = new CreepBodyDescriptor()
            creepBody.work = 2;
            creepBody.carry = 1;
            creepBody.move = 1;
            return creepBody;
        }
    }
    
