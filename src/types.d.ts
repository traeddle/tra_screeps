// example declaration file - remove these and add your own custom typings
import * as Enums from "helpers/Enums";
//declare const ROOM_STATE_INTRO = 0;
    


    



interface Memory {
  uuid: number;
  log: any;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}

