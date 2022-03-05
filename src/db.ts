import mongoose from 'mongoose';
// @ts-ignore
import databaseService from './service/database.service';

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
  await dbConnect();
  await databaseService.removeAllData();
  await databaseService.saveData(data);
  await dbDisconnect();
}