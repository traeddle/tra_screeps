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





