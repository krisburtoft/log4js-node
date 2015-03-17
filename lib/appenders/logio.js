'use strict';
var layouts = require('log4js').layouts,
net = require('net'),
port = 28777,
host = 'localhost',
util = require('util'),
os = require('os'),
passThrough = layouts.messagePassThroughLayout;



function logIoAppender(config, layout) {
  layout = passThrough;
  
  return function(loggingEvent) {
    var msg = layout(loggingEvent);
    var socket = new net.Socket();
    socket.connect(port,host,function(){
      var message = util.format('+log|%s|%s|%s|%s\r\n',loggingEvent.categoryName,os.hostname().toString(),loggingEvent.level.levelStr,msg);
      socket.write(message);
      socket.destroy();
    });
  };
}

function configure(config) {
  var layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }
  return logIoAppender(config, layout);
}

exports.name      = 'logio';
exports.appender  = logIoAppender;
exports.configure = configure;
