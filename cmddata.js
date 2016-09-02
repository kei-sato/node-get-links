//  cmddata.js
//
//  Example:
//    require('./cmddata')(function(err, data) { console.log(data); });

(function(){

'use strict';

var fs = require('fs');

function getDataFromPipe(callback) {
  var data = '';

  process.stdin.on('readable', function() {
    var chunk;
    while (null !== (chunk = this.read())) {
      data += chunk;
    }
  });
  process.stdin.on('end', function() {
     callback(null, data.trim());
  });
  process.stdin.on('error', callback);
}

function filterArgv(arr) {
  return arr.filter(function(str) {
    if (str.match(/node$/)) return false;
    if (str.match(/\.js$/)) return false;
    return true;
  });
}

function readFiles(paths, callback) {
  paths = paths || [];
  var result = [];
  var count = 0;
  var wait = function() {
    if (count++ < paths.length) setTimeout(wait, 300);
    return callback(null, result);
  };

  paths.forEach(function(path, i) {
    fs.readFile(path, 'utf8', function(err, data) {
      if (err) console.warn(err);
      result[i] = data;
      count++;
    });
  });

  wait();
}

function getData(argv, callback) {
  if (!callback) {
    callback = argv;
    argv = process.argv;
  }
  
  argv = filterArgv(argv);
  if (process.stdin.isTTY) {
    if (!argv.length) return callback();
    if (argv.length > 1) readFiles(argv, callback);
    else fs.readFile(argv[0], 'utf8', callback);
  } else {
    getDataFromPipe(callback);
  }
}

module.exports = getData;

})();