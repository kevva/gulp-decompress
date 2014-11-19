'use strict';

var Decompress = require('decompress');
var gutil = require('gulp-util');
var through = require('through2');

/**
 * Extract TAR, TAR.BZ2, TAR.GZ and ZIP archives
 *
 * @param {Object} opts
 * @api public
 */

module.exports = function (opts) {
	opts = opts || {};

	return through.obj(function (file, enc, cb) {
		var self = this;

		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-decompress', 'Streaming is not supported'));
			return;
		}

		var decompress = new Decompress()
			.src(file.contents)
			.use(Decompress.tar(opts))
			.use(Decompress.tarbz2(opts))
			.use(Decompress.targz(opts))
			.use(Decompress.zip(opts));

		decompress.run(function (err, files) {
			if (err) {
				cb(new gutil.PluginError('gulp-imagemin:', err, { fileName: file.path }));
				return;
			}

			files.forEach(self.push.bind(self));
			cb();
		});
	});
};
