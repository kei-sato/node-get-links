#!/usr/bin/env node
// example:
//   wget -qO- http://cs224d.stanford.edu/syllabus.html | tee /tmp/html | ./main.js --prefix='http://cs224d.stanford.edu/' | tee /tmp/href
'use strict';

const Url = require('url');
const Getopt = require('node-getopt');
const cheerio = require('cheerio');
const cmddata = require('./cmddata');

// Getopt arguments options
//   '=':   has argument
//   '[=]': has argument but optional
//   '+':   multiple option supported
const getopt = new Getopt([
  ['p', 'prefix=ARG', 'prefix to get absolute urls from relative paths'],
  ['h', 'help', 'display this help'],
]).bindHelp();

function parseHtml(text) {
  var result = [];

  // decodeEntities is required to handle Japanese
  var $ = cheerio.load(text, { decodeEntities: false });

  $('a').each((i, el) => result.push(el));

  return result.map(el => $(el).attr('href'));
}

function main() {
  const opt = getopt.parse(process.argv.slice(2));
  const prefix = opt.options.prefix || '';

  const regexProtocol = /^(https?):\/\//;
  const protocol = prefix.match(regexProtocol) ? prefix.match(regexProtocol)[1] : 'http';

  cmddata(opt.argv, function(err, data) {
    if (err) throw err;
    if (!data) return getopt.showHelp();
    const results = parseHtml(data);
    console.log(results.map(path => {
      const regexShort = /^\/\//;

      if (path.match(regexProtocol)) return path;
      if (path.match(regexShort)) return protocol + path;

      // relative path
      return Url.resolve(prefix, path);
    }));
  });
}

if (require.main === module) main(process.argv);

