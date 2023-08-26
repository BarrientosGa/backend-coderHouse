import winston from 'winston'
import config from '../config/config.js'

const customLevelsOptions = {
    levels : {
        fatal : 0 ,
        error : 1 ,
        warning : 2 ,
        info : 3 ,
        http : 4 ,
        debug : 5
    }
}

const devLogger = winston.createLogger({
    levels : customLevelsOptions.levels,
    transports : [
        new winston.transports.Console({level : 'debug'})
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports : [
        new winston.transports.Console({level : 'info'}),
        new winston.transports.File({filename: './errors.log' , level : 'error'})
    ]
})

export const addLogger = (req , res ,next) => {
    req.logger = config.environment == 'DEVELOPMENT' ? devLogger : prodLogger;
    req.logger.info(`${req.method} en ${req.url}`)
    next();
}