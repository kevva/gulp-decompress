# gulp-decompress [![Build Status](https://travis-ci.org/kevva/gulp-decompress.svg?branch=master)](https://travis-ci.org/kevva/gulp-decompress)

> Extract TAR, TAR.BZ2, TAR.GZ and ZIP archives using [decompress](https://github.com/kevva/decompress)


## Install

```
$ npm install gulp-decompress
```


## Usage

```js
const decompress = require('gulp-decompress');
const gulp = require('gulp');

gulp.task('default', () =>
	gulp.src('*.{tar,tar.bz2,tar.gz,zip}')
		.pipe(decompress({strip: 1}))
		.pipe(gulp.dest('dist'))
);
```


## Options

See the [decompress options](https://github.com/kevva/decompress#options).


## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
