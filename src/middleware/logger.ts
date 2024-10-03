import { timeStamp } from "console"
import { format } from "path/posix"
import pino from "pino"

const Log = pino({
  transport:{
    target:"pino-pretty",
    options: {
      colorize:true,
      translateTime: "SYS: HH:MM:ss dd-mm-yyyy",
      ignore:"pid,hostname",
      
    }
  }
})

export default Log