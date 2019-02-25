
export class ORDER {
  number: number;
  comment: string;
  commission: string;
  object: any = {};
  user: string;
  data: string;
}

export class OrderStates {
  states = [
    'SUBMITED',
    'RECEIVED',
    'GOODS_RECEIVED',
    'INPROGRESS',
    'GOODS_SENT'
  ];
}
