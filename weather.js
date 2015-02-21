var i2c = require('i2c-bus'),
  i2c1 = i2c.openSync(1);

var address = 0x40;

var TRIGGER_HUMD_MEASURE_NOHOLD = 0xF5;
var tempNoHold = 0xF3;
var tempHold = 0xE3;

(function() {
  i2c1.writeByteSync(address, tempHold, 0x01);
 
  setTimeout(function() {
    try {
      var msb = i2c1.readByteSync(address, tempHold);
      var lsb = i2c1.readByteSync(address, tempHold);
      var crc = i2c1.readByteSync(address, tempHold);
 
      var temperature = (msb << 8) | lsb;
    
      console.log(temperature);

    } catch (e) {
      console.log('some error happened ', e);
      throw e;
    } finally {
      console.log('closing connection...');
      i2c1.closeSync();
    }    
  }, 100);

}());
