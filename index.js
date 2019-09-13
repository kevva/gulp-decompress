'use strict';
const fs = require('fs');
const archiveType = require('archive-type');
const decompress = require('decompress');
const PluginError = require('plugin-error');
const {Transform} = require('readable-stream');
const Vinyl = require('vinyl');

module.exports = options => new Transform({
	objectMode: true,
	async transform(file, enc, cb) {
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

		try {
			const decompressedFiles = await decompress(file.contents, options);

			for (const decompressedFile of decompressedFiles) {
				const stats = new fs.Stats();

				stats.mtime = decompressedFile.mtime;

				if (decompressedFile.type === 'symlink') {
					stats.isSymbolicLink = () => true;
				} else {
					stats.mode = decompressedFile.mode;
					stats.isDirectory = () => decompressedFile.type === 'directory';
				}

				const vinylOptions = {
					stat: stats,
					contents: (stats.isDirectory() || stats.isSymbolicLink()) ? null : decompressedFile.data,
					path: decompressedFile.path
				};

				if (decompressedFile.linkname) {
					vinylOptions.symlink = decompressedFile.linkname;
				}

				this.push(new Vinyl(vinylOptions));
			}

			cb();
		} catch (error) {
			cb(new PluginError('gulp-decompress:', error, {fileName: file.path}));
		}
	}
});
