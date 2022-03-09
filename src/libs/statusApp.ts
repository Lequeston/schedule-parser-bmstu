import EventEmitter from 'events';

export let appStatus: 'PARSING' | 'BOT_WORK' | 'SAVING_DATA' = 'BOT_WORK';

const appStatusService = new EventEmitter();

appStatusService.on('start_parsing', () => {
  appStatus = 'PARSING';
});

appStatusService.on('end_parsing', () => {
  appStatus = 'BOT_WORK';
});

appStatusService.on('start_saving_data', () => {
  appStatus = 'SAVING_DATA';
});

appStatusService.on('end_saving_data', () => {
  appStatus = 'BOT_WORK';
});


export default appStatusService;