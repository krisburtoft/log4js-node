"use strict";
var assert = require('assert')
, vows = require('vows')
, layouts = require('../lib/layouts')
, sandbox = require('sandboxed-module');

vows.describe('../lib/appenders/logio').addBatch({
  'appender': {
    topic: function() {
      var messages = []
      , fakeSocket = {
        connect: function()
      }
      , fakeNet = {
        Socket: function(msg) { messages.push(msg); }
      }
      , appenderModule = sandbox.require(
        '../lib/appenders/logio',
        {
          globals: {
            'net': fakeNet
          }
        }
      )
      , appender = appenderModule.appender(layouts.messagePassThroughLayout);

      appender({ data: ["blah"] });
      return messages;
    },

    'should output to console': function(messages) {
      assert.equal(messages[0], 'blah');
    }
  }
          
}).exportTo(module);
