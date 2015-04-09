'use strict';

var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var isJpg = require('is-jpg');
var test = require('ava');
var decompress = require('../');

test('extract .tar', function (t) {
	t.plan(2);

	var stream = decompress();

	stream.on('data', function (file) {
		t.assert(isJpg(file.contents), isJpg(file.contents));
		t.assert(path.basename(file.path) === 'test.jpg', path.basename(file.path));
	});

	stream.end(new gutil.File({
		contents: fs.readFileSync(path.join(__dirname, 'fixtures/test.tar')),
		path: path.join(__dirname, 'fixtures/test.tar')
	}));
});

test('extract .tar.bz2', function (t) {
	t.plan(2);

	var stream = decompress();

	stream.on('data', function (file) {
		t.assert(isJpg(file.contents), isJpg(file.contents));
		t.assert(path.basename(file.path) === 'test.jpg', path.basename(file.path));
	});

	stream.end(new gutil.File({
		contents: fs.readFileSync(path.join(__dirname, 'fixtures/test.tar.bz2')),
		path: path.join(__dirname, 'fixtures/test.tar.bz2')
	}));
});

test('extract .tar.gz', function (t) {
	t.plan(2);

	var stream = decompress();

	stream.on('data', function (file) {
		t.assert(isJpg(file.contents), isJpg(file.contents));
		t.assert(path.basename(file.path) === 'test.jpg', path.basename(file.path));
	});

	stream.end(new gutil.File({
		contents: fs.readFileSync(path.join(__dirname, 'fixtures/test.tar.gz')),
		path: path.join(__dirname, 'fixtures/test.tar.gz')
	}));
});

test('extract .zip', function (t) {
	t.plan(2);

	var stream = decompress();

	stream.on('data', function (file) {
		t.assert(isJpg(file.contents), isJpg(file.contents));
		t.assert(path.basename(file.path) === 'test.jpg', path.basename(file.path));
	});

	stream.end(new gutil.File({
		contents: fs.readFileSync(path.join(__dirname, 'fixtures/test.zip')),
		path: path.join(__dirname, 'fixtures/test.zip')
	}));
});

test('ignore non-archive files', function (t) {
	t.plan(1);

	var stream = decompress();

	stream.on('data', function (file) {
		t.assert(path.basename(file.path) === 'test.js', path.basename(file.path));
	});

	stream.end(new gutil.File({
		contents: fs.readFileSync(__filename),
		path: __filename
	}));
});
