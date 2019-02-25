var express = require('express');
var http = require("http");
var bodyParser = require('body-parser');
var app = express();
var server = http.createServer(app);

app.set('port', 3000);
app.set('ip', '0.0.0.0');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/api/shop/getDataFromDb.php', function (req, res) {
  var customer = req.body.name;
  var config = require('./Customers/DB/'+customer+'.json');
  var i = 0;
  while (i < 999) {
    i++;
    console.log(i);
  }
  res.send(config);
});

app.get('/api/getCustomerNameAndConfig.php', function (req, res) {
  console.log(req.get('host'));
  var customers = require('./customers.json');
  var customer = customers[req.get('host')];
  var config = require('./Customers/config_'+customer+'.json').UI;
  var i = 0;
  while (i < 999) {
    i++;
    console.log(i);
  }
  var obj = {"Name": customer, "Config": config};
  res.send(JSON.stringify(obj));
});

app.get('/api/getMyAccount.php', function (req, res) {
  console.log(req.get('host'));
  var customers = require('./customers.json');
  var customer = customers[req.get('host')];
  var config = require('./Customers/config_'+customer+'.json').UI;
  var i = 0;
  while (i < 99999) {
    i++;
    console.log(i);
  }
  var obj = {"Name": customer, "Config": config};
  res.send(JSON.stringify(obj));
});

app.get('/api/modules/rma/setRma.php', function (req, res) {
  var i = 0;
  while (i < 99999) {
    i++;
    console.log(i);
  }
  res.send(JSON.stringify("hallo"));
});

app.get('/api/modules/rma/getRmaConfig.php', function (req, res) {
  var i = 0;
  while (i < 99999) {
    i++;
    console.log(i);
  }
  var rmas = require('./Customers/DB/modules/rma/failureDescription.json');
  res.send(JSON.stringify(rmas));
});

app.post('/api/modules/rma/getRmas.php', function (req, res) {
  var i = 0;
  while (i < 99999) {
    i++;
    console.log(i);
  }
  var rmas = require('./Customers/DB/modules/rma/data.json');
  res.send(JSON.stringify(rmas));
});

app.post('/api/modules/rma/sendRma.php', function (req, res) {
  var i = 0;
  while (i < 99999) {
    i++;
    console.log(i);
  }
  res.send(JSON.stringify('http://localhost:4200/customers/SMARTERION/datasheet/2_Systemkompontenten/DS_1000012_Mini%20Jolly%201_10V_Push.pdf'));
});

app.post('/api/modules/order/getOrders.php', function (req, res) {
  var i = 0;
  while (i < 99999) {
    i++;
    console.log(i);
  }
  var data = require('./Customers/DB/modules/orders/data.json');
  res.send(JSON.stringify(data));
});

app.post('/api/login/logoutUser.php', function (req, res) {
  var i = 0;
  while (i < 99999) {
    i++;
    console.log(i);
  }

  res.send(JSON.stringify(null));
});

app.post('/api/login/logoutUser.php', function (req, res) {
  var i = 0;
  while (i < 99999) {
    i++;
    console.log(i);
  }

  res.send(JSON.stringify(null));
});

app.post('/api/login/checkUser.php', function (req, res) {
  var i = 0;
  while (i < 99999) {
    i++;
    console.log(i);
  }
  var user = req.body.user;
  user.firstname = "John";
  user.lastname = "Doe";
  user.KundenNr = 1234234;
  user.KontaktNr = 999;
  user.token = "asf293aöfLKASDiafda";
  var data = {"status": "success", "message": user};
  res.send(JSON.stringify(data));
});

app.post('/api/shop/createOrder/create.php', function (req, res) {
  var i = 0;
  while (i < 999) {
    i++;
    console.log(i);
  }
  res.send(JSON.stringify(null));
});

server.listen(app.get('port'), function () {
  console.log('*** server started ***: ');
});
