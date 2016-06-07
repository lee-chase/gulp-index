# gulp-index

## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-index`

## Information

<table>
<tr>
<td>Package</td><td>gulp-index</td>
</tr>
<tr>
<td>Description</td>
<td>Creates an index of the files specified.</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 4.4.5</td>
</tr>
</table>

## Usage

```js
var index = require('gulp-index');

gulp.task('html:buildIndex', function() {
  return gulp.src('./src/client/**/*.*')
    .pipe(index())
    .pipe(gulp.dest('./dist/client'));
});
```

This will build a index.html from the files found in `./src/client` in the distribution folder `./dist/client`.

```html
<h1 class="index__title">Index page</h1>
<section class="index__section">
  <h2 class="index__section-heading">src</h2>
  <ul class="index__list">
    <li class="index__item">
      <a class="index__item-link" href="src/client/pages/home.html">src - client/pages/home.html</a>
    </li>
    <li class="index__item">
      <a class="index__item-link" href="src/client/pages/test.html">src - client/pages/test.html</a>
    </li>
    <li class="index__item">
      <a class="index__item-link" href="src/client/pages/about.html">src - client/pages/about.html</a>
    </li>
    <li class="index__item">
      <a class="index__item-link" href="src/client/components/button.html">src - client/components/button.html</a>
    </li>
  </ul>
</section>
```

Various options can be specified, the default are:

```js
{
  // Title for the index page
  'title': 'Index page',
  // Title template function used to construct the title section
  'title-template': (title) =>`<h1 class="index__title">${title}</h1>
`,
  // folders to use as heading, affected by 'relativePath'
  'pathDepth': 1,
  // Section start fuction used to construct begining of each section identified using path depth
  'section-start-template': () => `<section class="index__section">
`,
  // Section heading function used to construct each section heading
  'section-heading-template': (heading) => `<h2 class="index__section-heading">${heading}</h2>
`,
  // Section end function used to terminate a section
  'section-end-template': () => `</section>
`,
  // List start function used to begin a file list
  'list-start-template': () => `<ul class="index__list">
`,
  // List end function used to terminate a list
  'list-end-template': () => `</ul>
`,
  // Item function used to construct each list item
  'item-template': (filepath, filename) => `<li class="index__item"><a class="index__item-link" href="${filepath}/${filename}">${filepath} - ${filename}</a></li>
`,
  // part of path to discard e.g. './src/client' when creating index
  'relativePath': '',
  // name of output file
  'outputFile': './index.html',
  // initial tab depth
  'tab-depth': 0,
  // tab string, default is two spaces
  'tab-string': '  '
}
```

E.g.
```js
var index = require('gulp-index');

gulp.task('html:buildIndex', function({relativePath: './src/client'}) {
  return gulp.src('./src/client/**/*.*')
    .pipe(index())
    .pipe(gulp.dest('./dist/client'));
});
```

Splits pages and components into sections

```html
<h1 class="index__title">Index page</h1>
<section class="index__section">
  <h2 class="index__section-heading">pages</h2>
  <ul class="index__list">
    <li class="index__item">
      <a class="index__item-link" href="pages/home.html">pages - home.html</a>
    </li>
    <li class="index__item">
      <a class="index__item-link" href="pages/test.html">pages - test.html</a>
    </li>
    <li class="index__item">
      <a class="index__item-link" href="pages/about.html">pages - about.html</a>
    </li>
  </ul>
</section>
<section class="index__section">
  <h2 class="index__section-heading">components</h2>
  <ul class="index__list">
    <li class="index__item">
      <a class="index__item-link" href="components/button.html">components - button.html</a>
    </li>
  </ul>
</section>
```


## LICENSE

The MIT License (MIT)

Copyright (c) 2016 Lee Chase <leechase@live.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
