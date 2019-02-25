import * as moment from 'moment';
import {User} from '../../../data-cache/data-cache-handler.service';

export class RMA {
  number = 'RMA_' + Date.now();
  user: User;
  date = moment().format('DD-MM-YYYY HH:mm');
  detail: any = {
    'PARTNR_DELIVERYNR_INVOICENR': '',
    'FAILURE': '',
    'FAILURE_DESCRIPTION':  '',
    'NUMBER_OF_ELEMENTS': '',
    'PARTNUMBER_OF_ELEMENTS': '',
    'TIME_OF_ERROR_DETECTION': ''
  };
  state = 'SUBMITED';
}

export class RmaStates {
  states = [
    'SUBMITED',
    'RECEIVED',
    'GOODS_RECEIVED',
    'INPROGRESS',
    'GOODS_SENT'
  ];
}
