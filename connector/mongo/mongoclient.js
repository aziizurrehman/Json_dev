const config = require('config');
const MongoClient = require('mongodb').MongoClient;
var mongoclient; //global

const loggerJs = require('../../common/utils/logger/logger');
const logger = loggerJs.pinoChildInstance('Mongo', 123)

class MongoDbClient {
  constructor(url, dbName) {

    this.logger = logger; 
    this.url = url;
    this.dbName = dbName;
  }
  async connect(onSuccess, onFailure) {
    try {
     // var confirmurl = `mongodb://TestUser:testsoa@${config.api.accountBalanceMobile.v1.mongodbIP}:${config.api.accountBalanceMobile.v1.mongodbPORT}/SOA_Revised`;

      var connection = await MongoClient.connect(this.url, { useNewUrlParser: true });
      mongoclient = connection.db(this.dbName);
       
     // db.serverConfig.isConnected();
      // console.log(mongoclient.serverConfig.isConnected(),"MongoClient Connection successfull.");
      onSuccess(this.logger);
    }
    catch (ex) {
      
      console.log("Error caught,", ex);
      onFailure(ex);
      return { error: { message : "DB Error: ",developerMessage: ex.toString()}}
    }
  }
  async findDocByAggregation(coll, query) {
    if (!query.length) {
      throw Error("mongoClient.findDocByAggregation: query is not an object");
    }
    return this.mongoclient.collection(coll).aggregate(query).toArray();
  }
  async promiseMethod(dataCollection, accontNo, from_date, to_date, fromYear, toYear) {
    var ss = this;
    return new Promise(async function (resolve, reject) {
      console.log(mongoclient)
      if(mongoclient == undefined){
        return { error: { message: "DB error "}}
      }
      const yearCount = toYear - fromYear;
      var mainCollection = [];
      if (yearCount == 0) {
        mongoclient.collection( config.get('api.accountBalanceMobile.v1.collectionName') + fromYear)
          .aggregate([{ $match: { NEEAN: accontNo, SAPOD: { $gte: from_date, $lte: to_date } } },
          { $project: { _id: 0, "SAAB": 1, "SAAN": 1, "SAAS": 1, "SAPOD": 1, "SABRNM": 1, "SAPBR": 1, "SAPSQ": 1, "SAVFR": 1, "SABRND": 1, "SADRF": 1, "SANEGP": 1, "SAAMA": 1, "SATCD": 1, "SACCY": 1, "SASRC": 1, "SAUC1": 1, "SAUC2": 1, "SAYNAR": 1, "SAYREC": 1, "SATSTP": 1, "SAEVNK": 1, "SCBAL": 1, "OpeningBalance": 1, "RunningBalance": 1, "NEEAN": 1, "NEIBAN": 1, "INTERNALACC": 1, "TRANSID": 1, "SAAPP": 1, "SANPE": 1, "SADLS": 1, "SAPRVF": 1, "SAPRNP": 1, "SASIG": 1, "SASTN": 1, "SAYPTD": 1, "SAPTYP": 1, "SALSTN": 1, "SATFRS": 1, "SAABI": 1, "NEAB": 1, "NEAN": 1, "NEAS": 1, "SCACT": 1, "SCCTP": 1, "SGNR1": 1, "SGNR2": 1, "SGNR3": 1, "SGNR4": 1, "ConvertedDate": 1, "C4CTD": 1, "C5ATD": 1, "CABRN": 1, "CTTCN": 1, TranSeq: { $toInt: "$TranSeq" } } },
          { $sort: { SAPOD: 1, ConvertedDate: 1, TranSeq: -1 } }
          ]).toArray(function (err, tranData) {
            if (err) reject()

            if (tranData && tranData.length) {
              for (var internnalIndex = 0; internnalIndex < tranData.length; internnalIndex++) {
                //console.log('internnalIndex ==>', internnalIndex);
                dataCollection.push(tranData[internnalIndex]);
              }
            }
          
            resolve(dataCollection);
          });
      }
      else {
        var coll;
        for (var index = fromYear; index <= toYear; index++) {
          coll = await ss.getDbData(dataCollection, index, accontNo, from_date, to_date, fromYear, toYear)
        
        }
     
        resolve(coll);
      }
    });

  }

  async getDbData(dataCollection, index, accontNo, from_date, to_date, fromYear, toYear) {
    return new Promise((resolve, reject) => {

      if (index == fromYear) {
        console.log("==========from")
        mongoclient.collection(config.get('api.accountBalanceMobile.v1.collectionName') + index)
          .aggregate([{ $match: { NEEAN: accontNo, SAPOD: { $gte: from_date } } },
          { $project: { _id: 0, "SAAB": 1, "SAAN": 1, "SAAS": 1, "SAPOD": 1, "SABRNM": 1, "SAPBR": 1, "SAPSQ": 1, "SAVFR": 1, "SABRND": 1, "SADRF": 1, "SANEGP": 1, "SAAMA": 1, "SATCD": 1, "SACCY": 1, "SASRC": 1, "SAUC1": 1, "SAUC2": 1, "SAYNAR": 1, "SAYREC": 1, "SATSTP": 1, "SAEVNK": 1, "SCBAL": 1, "OpeningBalance": 1, "RunningBalance": 1, "NEEAN": 1, "NEIBAN": 1, "INTERNALACC": 1, "TRANSID": 1, "SAAPP": 1, "SANPE": 1, "SADLS": 1, "SAPRVF": 1, "SAPRNP": 1, "SASIG": 1, "SASTN": 1, "SAYPTD": 1, "SAPTYP": 1, "SALSTN": 1, "SATFRS": 1, "SAABI": 1, "NEAB": 1, "NEAN": 1, "NEAS": 1, "SCACT": 1, "SCCTP": 1, "SGNR1": 1, "SGNR2": 1, "SGNR3": 1, "SGNR4": 1, "ConvertedDate": 1, "C4CTD": 1, "C5ATD": 1, "CABRN": 1, "CTTCN": 1, TranSeq: { $toInt: "$TranSeq" } } },
          { $sort: { SAPOD: 1, ConvertedDate: 1, TranSeq: -1 } }
          ])
          .toArray(function (err, tranData) {
            if (err) reject()
            if (tranData && tranData.length) {
              for (var internnalIndex = 0; internnalIndex < tranData.length; internnalIndex++) {
                dataCollection.push(tranData[internnalIndex]);
              }
            }

            resolve(dataCollection);
          });
      }
      else if (index != fromYear && index != toYear) {
        mongoclient.collection(config.get('api.accountBalanceMobile.v1.collectionName') + index)
          .aggregate([{ $match: { NEEAN: accontNo } },
          { $project: { _id: 0, "SAAB": 1, "SAAN": 1, "SAAS": 1, "SAPOD": 1, "SABRNM": 1, "SAPBR": 1, "SAPSQ": 1, "SAVFR": 1, "SABRND": 1, "SADRF": 1, "SANEGP": 1, "SAAMA": 1, "SATCD": 1, "SACCY": 1, "SASRC": 1, "SAUC1": 1, "SAUC2": 1, "SAYNAR": 1, "SAYREC": 1, "SATSTP": 1, "SAEVNK": 1, "SCBAL": 1, "OpeningBalance": 1, "RunningBalance": 1, "NEEAN": 1, "NEIBAN": 1, "INTERNALACC": 1, "TRANSID": 1, "SAAPP": 1, "SANPE": 1, "SADLS": 1, "SAPRVF": 1, "SAPRNP": 1, "SASIG": 1, "SASTN": 1, "SAYPTD": 1, "SAPTYP": 1, "SALSTN": 1, "SATFRS": 1, "SAABI": 1, "NEAB": 1, "NEAN": 1, "NEAS": 1, "SCACT": 1, "SCCTP": 1, "SGNR1": 1, "SGNR2": 1, "SGNR3": 1, "SGNR4": 1, "ConvertedDate": 1, "C4CTD": 1, "C5ATD": 1, "CABRN": 1, "CTTCN": 1, TranSeq: { $toInt: "$TranSeq" } } },
          { $sort: { SAPOD: 1, ConvertedDate: 1, TranSeq: -1 } }
          ])
          .toArray(function (err, tranData) {
            if (err) reject()
            for (var internnalIndex = 0; internnalIndex < tranData.length; internnalIndex++) {
              dataCollection.push(tranData[internnalIndex]);
            }
            resolve(dataCollection);
          });
      }

      else if (index == toYear) {
        mongoclient.collection(config.get('api.accountBalanceMobile.v1.collectionName') + index)
          .aggregate([{ $match: { NEEAN: accontNo, SAPOD: { $lte: to_date } } },
          { $project: { _id: 0, "SAAB": 1, "SAAN": 1, "SAAS": 1, "SAPOD": 1, "SABRNM": 1, "SAPBR": 1, "SAPSQ": 1, "SAVFR": 1, "SABRND": 1, "SADRF": 1, "SANEGP": 1, "SAAMA": 1, "SATCD": 1, "SACCY": 1, "SASRC": 1, "SAUC1": 1, "SAUC2": 1, "SAYNAR": 1, "SAYREC": 1, "SATSTP": 1, "SAEVNK": 1, "SCBAL": 1, "OpeningBalance": 1, "RunningBalance": 1, "NEEAN": 1, "NEIBAN": 1, "INTERNALACC": 1, "TRANSID": 1, "SAAPP": 1, "SANPE": 1, "SADLS": 1, "SAPRVF": 1, "SAPRNP": 1, "SASIG": 1, "SASTN": 1, "SAYPTD": 1, "SAPTYP": 1, "SALSTN": 1, "SATFRS": 1, "SAABI": 1, "NEAB": 1, "NEAN": 1, "NEAS": 1, "SCACT": 1, "SCCTP": 1, "SGNR1": 1, "SGNR2": 1, "SGNR3": 1, "SGNR4": 1, "ConvertedDate": 1, "C4CTD": 1, "C5ATD": 1, "CABRN": 1, "CTTCN": 1, TranSeq: { $toInt: "$TranSeq" } } },
          { $sort: { SAPOD: 1, ConvertedDate: 1, TranSeq: -1 } }
          ])
          .toArray(function (err, tranData) {
            if (err) reject()
            for (var internnalIndex = 0; internnalIndex < tranData.length; internnalIndex++) {
              dataCollection.push(tranData[internnalIndex]);
            }
            resolve(dataCollection);
          });
      }

    })
  }

  convertToMonth (month, date) {
    let monthFromDate = date.substring(3, 5);
    let monthInEnglish = month.find((item, i) => (i + 1) == monthFromDate);
    let properDate = date.substring(5, 7) + '/' + monthInEnglish + '/' + date.substring(1, 3);
    return properDate;
  }

  comparingDate (lastRecordDate, toDate) {

    let year = '20' + lastRecordDate.substring(1, 3);
    let month = lastRecordDate.substring(3, 5);
    let day = lastRecordDate.substring(5, 7);
    let getTmrwDate = new Date(month + '-' + day + '-' + year);
    getTmrwDate = new Date(getTmrwDate.setDate(getTmrwDate.getDate() + 1));

    let _month = getTmrwDate.getMonth() + 1;
    if (_month && _month < 10) {
      _month = '0' + _month;
    }
    let _day = getTmrwDate.getDate();
    if (_day && _day < 10) { _day = '0' + _day; }

    if (toDate > lastRecordDate) {
      return getTmrwDate.getFullYear() + '' + _month + '' + _day;
    }
    else { 
      return ''; 
    }
  }

}


module.exports = MongoDbClient;