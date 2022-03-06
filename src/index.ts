import 'dotenv/config';

import bot from './bot';
import { saveParseData } from './db';
import parse from './parser';

const isParsing: boolean = Boolean(process.env.IS_PARSING) || false;

const start = async () => {
  try {
    isParsing && await parse(saveParseData);
    await bot.launch();
  } catch(e) {
    console.error(e);
  }
}

start();



