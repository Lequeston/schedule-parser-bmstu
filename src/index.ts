
import 'dotenv/config';

const bot = require('./bot.js');
const { saveParseData } = require('./db.js');
import parse from './parser';


const start = async () => {
  try {
    //await parse(saveParseData);
    bot.launch();
  } catch(e) {
    console.error(e);
  }
}

start();



