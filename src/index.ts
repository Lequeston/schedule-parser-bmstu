import 'dotenv/config';

import bot from './bot';
import { saveParseData } from './db';
import parse from './parser';


const start = async () => {
  try {
   // await parse(saveParseData);
    bot.launch();
  } catch(e) {
    console.error(e);
  }
}

start();



