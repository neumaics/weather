var i2c = require('i2c');
var address = 0x40;
var wire = new i2c(address, {device: '/dev/i2c-1'}); 

var tempBlocking = 0xE3;
 
wire.scan(function(err, data) {
  console.log(data);
});

wire.write([tempBlocking], function(err) {
  if (err) {
    console.log(err);
    throw err;
  }

  console.log('Wrote ', tempBlocking, ' to device');
  console.log('Reading result');
    
  wire.read(3, function(err, res) {
    if (err) {
      console.log(err);
      throw err;
    } else {
      var temperature = (res[0] << 8) | res[1];
      temperature = temperature & 0xFFFC;
      //console.log(res.toString('utf8',0,3));
      console.log(temperature);
    }
  });
});


 
