import winston from 'winston';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

const level = () => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'development' ? 'debug' : 'info'; 
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
};
winston.addColors(colors); // add colors to the logs

// define the format of the logs
const format = winston.format.combine(
    // add a timestamp to the logs
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    // add a color to the logs
    winston.format.colorize({ all: true }),
    // define the format of the logs
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`    
    )
);

// define where the logs will be stored and in what format
const transports = [
    // wrtie logs to the console
    new winston.transports.Console()
];

export const Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports
});