var i2c = require('i2c');
var address = 0x40;
var wire = new i2c(address, {device: '/dev/i2c-1'});

var tempBlocking = 0xE3;

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
          console.log(temperature, Math.floor(new Date() / 1000));
        }
      });
    }, 50);
  });
}

setInterval(function(){
  getTemp();
}, 1000);