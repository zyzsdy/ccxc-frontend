import Vue from 'vue'
import { PluginObject } from 'vue'

declare interface globalConst {
    apiRoot: string;
    puzzleRoot: string;
    globalBus: Vue;
  }
  
declare module 'vue/types/vue' {
    interface Vue{
        $gConst: globalConst;
    }
}

class GlobalConst implements PluginObject<never>{
    install(vue: typeof Vue): void{
        vue.prototype.$gConst = {
            apiRoot: "https://api.ccbc11.test/api/v1",
            puzzleRoot: "https://puzzle.ccbc11.test:3000",
            //apiRoot: "https://apiv2.cipherpuzzles.com/api/v1",
            //puzzleRoot: "https://c11-puzzle.cipherpuzzles.com",
            globalBus: new Vue()
        }
    }
}

export default new GlobalConst();