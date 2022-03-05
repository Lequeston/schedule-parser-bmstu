const mongoose = require('mongoose');

const databaseService = require('./service/database.service');

const dbConnect = async () => {
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

const dbDisconnect = async () => {
  await mongoose.disconnect();
}

const saveParseData = async (data) => {
  await dbConnect();
  await databaseService.removeAllData();
  await databaseService.saveData(data);
  await dbDisconnect();
}

module.exports = {
  saveParseData,
  dbConnect,
  dbDisconnect
};