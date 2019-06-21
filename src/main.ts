import { ErrorMapper } from "utils/ErrorMapper";
import { CreepHelper } from "helpers/CreepHelper";
import { SpawnHelper } from "helpers/SpawnHelper";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
    if (Game.time % 50 == 0) {
        console.log(`blah ${Game.time}`);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////

    //add constuction sites for extensions and roads
    //for roads creeps can report their when they are off road and well keep the locations and counts for each position in the last 1000 ticks and build roads based on that...
    //or maybe just do some paths say from energy source to spawn and create a road
    //not sure how to create extensions yet

    //add container/storage and link mining

    //create a job queue for creeps to pull from

    SpawnHelper.Run();

    
    CreepHelper.Run();


    ///////////////////////////////////////////////////////////////////////////////////////////////


    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            console.log(`delete ${name}`);
            delete Memory.creeps[name];
        }
    }

});





