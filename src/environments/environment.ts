export const environment = {
  production: true,
  urls : {
    customers : 'http://smarterion.ch/OnlinePortal/customers/',
    api : {
      login: 'http://localhost:3000/api/login/',
      shop: 'http://localhost:3000/api/shop/',
      rma: 'http://localhost:3000/api/modules/rma/',
      order: 'http://localhost:3000/api/modules/order/'
    },
    getCustomerNameAndConfig: 'http://localhost:3000/api/getCustomerNameAndConfig.php'
  }
};
