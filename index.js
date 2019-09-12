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

					stat.mtime = x.mtime;
					if (x.type === 'symlink') {
						stat.isSymbolicLink = () => true;
					} else {
						stat.mode = x.mode;
						stat.isDirectory = () => x.type === 'directory';
					}

					const vinylOptions = {
						stat,
						contents: (stat.isDirectory() || stat.isSymbolicLink()) ? null : x.data,
						path: x.path
					};
					if (x.linkname) {
						vinylOptions.symlink = x.linkname;
					}

					this.push(new Vinyl(vinylOptions));
				}

				cb();
			})
			.catch(error => {
				cb(new PluginError('gulp-decompress:', error, {fileName: file.path}));
			});
	}
});
