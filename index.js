'use strict';

let defaults = require('defaults'),
  path = require('path'),
  through = require('through2').obj,
  File = require('gulp-util').File;

module.exports = function(opts) {

  opts = defaults(opts, {
    'prepend-to-output': () => `<head>
</head>
<body>
`,
    'append-to-output': () => `</body>
`,
    'title': 'Index page',
    'title-template': (title) =>`<h1 class="index__title">${title}</h1>
`,
    'pathDepth': 1, // folders to use as heading, affected by 'relativePath'
    'section-start-template': () => `<section class="index__section">
`,
    'section-heading-template': (heading) => `<h2 class="index__section-heading">${heading}</h2>
`,
    'section-end-template': () => `</section>
`,
    'list-start-template': () => `<ul class="index__list">
`,
    'list-end-template': () => `</ul>
`,
    'item-template': (filepath, filename) => `<li class="index__item"><a class="index__item-link" href="${filepath}/${filename}">${filepath} - ${filename}</a></li>
`,
    'relativePath': './src/client',
    'outputFile': './index.html',
    'tab-depth': 0,
    'tab-string': '  '
  });

  let listTab = opts['list-start-template']() ? 1 : 0;
  let frontMatter = opts['prepend-to-output']();
  let endMatter = opts['append-to-output']();
  let bodyTab = frontMatter.length > 0 ? 1 : 0;
  let tabDepth = opts['tab-depth'];
  let tabIt = function(depth) {
    return opts['tab-string'].repeat(depth);
  };

  let files = [];

  let onChunk = function(chunk, encoding, callback) {
    files.push(path.relative(opts.relativePath, chunk.path));
    return callback();
  };

  let onFlush = function(callback) {
    let output, itemList, outFile, rollingPath = '';

    output = tabIt(tabDepth) + frontMatter;
    output += tabIt(tabDepth + bodyTab) + opts['title-template'](opts.title);

    if (files.length) {
      files.sort((a, b) => a.localeCompare(b));

      files.forEach(function(file) {
        let currentPath, remainingPath;
        let pathParts = file.split('/');
        pathParts.length = (opts.pathDepth < pathParts.length ? opts.pathDepth : pathParts.length);
        currentPath = pathParts.join('/');

        if (currentPath !== rollingPath) {
          if (rollingPath !== '') {
            output += itemList;
            if (listTab) {
              output += tabIt(tabDepth + bodyTab) + opts['list-end-template']();
            }
            output += tabIt(tabDepth + bodyTab) + opts['section-end-template']();
          }
          rollingPath = currentPath;

          output += tabIt(tabDepth + bodyTab) + opts['section-start-template']();
          output += tabIt(tabDepth + bodyTab) + opts['section-heading-template'](rollingPath);
          if (listTab) {
            output += tabIt(tabDepth + bodyTab) + opts['list-start-template']();
          }

          itemList = '';
        }

        itemList += tabIt(tabDepth + listTab + bodyTab) + opts['item-template'](rollingPath, file.substr(currentPath.length + 1));
      });

      output += itemList;
      if (listTab) {
        output += tabIt(tabDepth + bodyTab) + opts['list-end-template']();
      }
      output += tabIt(tabDepth + bodyTab) + `</section>
`;
    }
    output += tabIt(tabDepth) + endMatter;

    outFile = new File({
      path: opts.outputFile,
      contents: new Buffer(output)
    });

    this.push(outFile); // eslint-disable-line no-invalid-this
    return callback();
  };

  return through(onChunk, onFlush);
};
