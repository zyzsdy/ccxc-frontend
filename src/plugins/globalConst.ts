import Vue from 'vue'
import { PluginObject } from 'vue'

declare interface globalConst {
    apiRoot: string;
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
            apiRoot: "https://localhost/api/v1",
            globalBus: new Vue()
        }
    }
}

export default new GlobalConst();