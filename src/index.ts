import 'dotenv/config';
import fs from 'fs';

//import bot from './bot';
//const { saveParseData } = require('./db.js');
import parse from './parser';


const start = async () => {
  try {
    await parse((data) => {
      fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
    });
    //bot.launch();
  } catch(e) {
    console.error(e);
  }
}

start();



