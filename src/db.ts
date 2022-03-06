import mongoose from 'mongoose';
// @ts-ignore
import databaseService from './service/database.service';
import appStatusService from './statusApp';

export const dbConnect = async () => {
  await mongoose.connect(process.env.DB_URL || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as mongoose.ConnectOptions);
}

export const dbDisconnect = async () => {
  await mongoose.disconnect();
}

export const saveParseData = async (data: any) => {
  appStatusService.emit('start_saving_data');
  console.log('start_saving');
  await dbConnect();
  await databaseService.removeAllData();
  await databaseService.saveData(data);
  await dbDisconnect();
  appStatusService.emit('end_saving_data');
}