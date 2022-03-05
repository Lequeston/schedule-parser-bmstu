
import 'dotenv/config';

const bot = require('./bot.js');
const { saveParseData } = require('./db.js');
const parse = require('./parser.js');


const start = async () => {
  try {
    //await parse(saveParseData);
    bot.launch();
  } catch(e) {
    console.error(e);
  }
}

start();



