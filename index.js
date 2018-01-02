'use strict';
const fs = require('fs');
const archiveType = require('archive-type');
const decompress = require('decompress');
const PluginError = require('plugin-error');
const Transform = require('readable-stream/transform');
const Vinyl = require('vinyl');

module.exports = opts => new Transform({
	objectMode: true,
	transform(file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new PluginError('gulp-decompress', 'Streaming is not supported'));
			return;
		}

		if (!archiveType(file.contents)) {
			cb(null, file);
			return;
		}

		decompress(file.contents, opts)
			.then(files => {
				for (const x of files) {
					const stat = new fs.Stats();

					stat.mode = x.mode;
					stat.mtime = x.mtime;
					stat.isDirectory = () => x.type === 'directory';

					this.push(new Vinyl({
						stat,
						contents: stat.isDirectory() ? null : x.data,
						path: x.path
					}));
				}

				cb();
			})
			.catch(err => {
				cb(new PluginError('gulp-decompress', err, {fileName: file.path}));
			});
	}
});
