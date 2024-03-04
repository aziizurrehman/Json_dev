const pino = require('pino');
const config = require('config');
const path = require('path')
const rfs = require('rotating-file-stream');

// const producer = require('../../../kafkaConfig/producer')

// const { channel } = require('diagnostics_channel');
// const { v4: uuidv4 } = require('uuid');



const level =  config.get('logging.environment') == 'dev' ? 'debug' :'info';
  

const options = {
    useLevelLabels: true,
    level: level,
    timestamp: () => {
        return ', "time":"' + new Date().toLocaleString() + "\""
    },
    messageKey: 'message',
    redact: {
        paths: ['pid', 'hostname', 'endpointName','password'],
        remove: true,
    },
    formatters: {
        level (label) {
          return { level: label }
        }
      },
  }
  

const appLogger = {}

function createFileStream(fileName) {

    // let filename = 'SERVER-2024-01-17.json'
    let filepath = path.join(__dirname, '../../../logs'); 
    const stream = rfs.createStream(fileName, {
        interval: '1d', // Rotate daily
        path: filepath,
        size: '100M', // Rotate when the file size exceeds 100MB
    });

    return stream;
}


const pinoInstance = (channel) => {
 if(channel) {
   channel = channel.toUpperCase() + '.log';
   if(appLogger[channel]) {
    return appLogger[channel]
   } else {
    //    const childLogger = pino(options, pino.destination(config.get('logging.base_path') + channel + '.log'));
        const childLogger = pino(options,createFileStream(channel))
       appLogger[channel] = childLogger
       return childLogger
   }
 } else {
    const serverLog = config.get('logging.default_file').toUpperCase() + '-' + new Date().toISOString().split('T')[0] + '.log'
        if (appLogger[serverLog]) {
            return appLogger[serverLog]
        } else {
            // const parentLogger = pino(options, pino.destination(process.env.LOG_FILE_PATH || config.get('logging.base_path') + serverLog))
            const fileName = serverLog
            const parentLogger = pino(options, createFileStream(fileName))
            appLogger[serverLog] = parentLogger
            return parentLogger

        }
 }
}

function fileNameFormatter(channel,properties){
    const datedChannel = channel && properties.endpointName ? channel + '-' + properties.endpointName + '-' + new Date().toISOString().split('T')[0]: undefined; // Append system date to channel

    return datedChannel;
    
}

const pinoChildInstance = (channel, properties = {reqId: '', 
        TopicName: "Test-Topic",Partition: "Test-Partition",}) => {
        const formattedChannel = fileNameFormatter(channel,properties)
        return pinoInstance(formattedChannel).child(properties)
    }

function CommonDebugLogger (headers,fileName){
    return pinoChildInstance(headers["xChannelId"], {
        reqId: headers["xReqId"],
        fileName:fileName,
        TopicName: "Test-Topic",
        Partition: "Test-Partition",
        endpointName:headers['xEndpoint']
      });

}



module.exports = {
    pinoInstance,
    pinoChildInstance,
    CommonDebugLogger
    
}

