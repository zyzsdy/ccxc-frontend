import Vue from 'vue'
import { PluginObject } from 'vue'

declare interface globalConst {
    apiRoot: string;
    globalBus: Vue;
  }
  
declare module 'vue/types/vue' {
    interface Vue{
        $gConst: globalConst
    }
}

class GlobalConst implements PluginObject<never>{
    install(vue: typeof Vue): void{
        vue.prototype.$gConst = {
            apiRoot: "http://localhost:52412/api/v1",
            globalBus: new Vue()
        }
    }
}

export default new GlobalConst();