'use strict';

let defaults = require('defaults'),
  path = require('path'),
  through = require('through2').obj,
  File = require('gulp-util').File;

module.exports = function(opts) {

  opts = defaults(opts, {
    // written out before index contents
    'prepend-to-output': () => `<head>
</head>
<body>
`,
    // written out after index contents
    'append-to-output': () => `</body>
`,
    // Title for the index page
    'title': 'Index page',
    // Title template function used to construct the title section
    'title-template': (title) =>`<h1 class="index__title">${title}</h1>
`,
    // folders to use as heading, affected by 'relativePath'
    'pathDepth': 1,
    // Section function used to construct each section identified using path depth
    'section-template': (sectionContent) => `<section class="index__section">
${sectionContent}</section>
`,
    // Section heading function used to construct each section heading
    'section-heading-template': (heading) => `<h2 class="index__section-heading">${heading}</h2>
`,
    // List function used to construct a file list
    'list-template': (listContent) => `<ul class="index__list">
${listContent}</ul>
`,
    // Item function used to construct each list item
    'item-template': (filepath, filename) => `<li class="index__item"><a class="index__item-link" href="${filepath}/${filename}">${filepath} - ${filename}</a></li>
`,
    // part of path to discard e.g. './src/client' when creating index
    'relativePath': './src/client',
    // name of output file
    'outputFile': './index.html',
    // initial tab depth
    'tab-depth': 0,
    // tab string, default is two spaces
    'tab-string': '  '
  });

  let listTab;
  let frontMatter = opts['prepend-to-output']();
  let endMatter = opts['append-to-output']();
  let bodyTab = frontMatter.length > 0 ? 1 : 0;
  let tabDepth = opts['tab-depth'];
  let tabString = opts['tab-string'];
  let sectionTemplate, listTemplate;

  if (opts['section-start-template'] || opts['section-end-template']) {
    console.log('section-start-template and section-end-template deprecated and will be removed for v1.0.0 Use section-template.');

    try {
      sectionTemplate = (sectionContent) => opts['section-start-template']() + sectionContent + opts['section-end-template']();
    } catch (e) {
      sectionTemplate = (sectionContent) => sectionContent;
    }
  } else {
    sectionTemplate = opts['section-template'];
  }

  if (opts['list-start-template'] || opts['list-end-template']) {
    console.log('list-start-template and list-end-template deprecated and will be removed for v1.0.0 Use list-template.');

    try {
      let listStart = opts['list-start-template']();
      listTab = listStart.length > 0 ? 1 : 0;
      listTemplate = (listContent) => listStart + listContent + opts['list-end-template']();
    } catch (e) {
      listTab = 0;
      listTemplate = (listContent) => listContent;
    }
  } else {
    listTemplate = opts['list-template'];
    listTab = listTemplate('').length > 0 ? 1 : 0;
  }

  let tabIt = function(depth, tab, srcString) {
    var regex = /^(.)/gm; // non empty line start
    var tabN = tab.repeat(depth);
    return srcString.replace(regex, tabN + '$1');
  };

  let files = [];

  let onChunk = function(chunk, encoding, callback) {
    files.push(path.relative(opts.relativePath, chunk.path));
    return callback();
  };

  let onFlush = function(callback) {
    let output, itemList, outFile, rollingPath = '';

    output = tabIt(tabDepth, tabString, frontMatter.toString());
    output += tabIt(tabDepth + bodyTab, tabString, opts['title-template'](opts.title));

    if (files.length) {
      files.sort((a, b) => a.localeCompare(b));

      files.forEach(function(file) {
        let currentPath, remainingPath;
        let pathParts = file.split('/');
        pathParts.length = (opts.pathDepth < pathParts.length ? opts.pathDepth : pathParts.length);
        currentPath = pathParts.join('/');

        if (currentPath !== rollingPath) {
          if (rollingPath !== '') {
            let listAndHeading = tabIt(listTab, tabString, opts['section-heading-template'](rollingPath) + itemList);
            let listTmp = tabIt(1, tabString, listTemplate(listAndHeading));
            output += tabIt(tabDepth + bodyTab, tabString, sectionTemplate(listTmp));
          }
          rollingPath = currentPath;

          itemList = '';
        }

        itemList += opts['item-template'](rollingPath, file.substr(currentPath.length + 1));
      });

      if (itemList.length > 0) {
        let listAndHeading = tabIt(listTab, tabString, opts['section-heading-template'](rollingPath) + itemList);
        let listTmp = tabIt(1, tabString, listTemplate(listAndHeading));
        output += tabIt(tabDepth + bodyTab, tabString, sectionTemplate(listTmp));
      }
    }
    output += tabIt(tabDepth, tabString, endMatter.toString());

    outFile = new File({
      path: opts.outputFile,
      contents: new Buffer(output)
    });

    this.push(outFile); // eslint-disable-line no-invalid-this
    return callback();
  };

  return through(onChunk, onFlush);
};
