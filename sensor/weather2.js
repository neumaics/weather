var i2c = require('i2c');
var address = 0x40;
var wire = new i2c(address, {device: '/dev/i2c-1'});

var tempBlocking = 0xE3;

var Client = require('node-rest-client').Client;

var client = new Client();

function getTemp() {
  wire.write([tempBlocking], function(err) {
    if (err) {
      console.log(err);
      throw err;
    }

    setTimeout(function() {
      wire.read(3, function(err, res) {
        if (err) {
          console.log(err);
          throw err;
        } else {
          var temperature = (res[0] << 8) | res[1];
          temperature = temperature & 0xFFFC;

          temperature = -46.85 + (175.72 * (temperature / 65536));

          sendData(temperature);
        }
      });
    }, 50);
  });
}

function sendData(value) {
  var ts = new Date();

  var args = {
    data: { value: value, timestamp: ts.toISOString() },
    headers:{"Content-Type": "application/json"}
  };

  client.post("http://192.168.1.239:8080/api/temperature", args,
    function(data,response) {
      console.log(response);
    }
  );
}

setInterval(function(){
  getTemp();
}, 1000);
