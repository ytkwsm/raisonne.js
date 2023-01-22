
import { config } from '../config/config-values'

export function trace(logMsg: any, flg?: boolean) {
    // for debug
    if (config.debug && flg || config.debug && flg == undefined || config.debug == false && flg == true) { return console.log(logMsg); }
    else { return; }
}