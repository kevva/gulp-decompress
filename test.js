import fs from 'fs';
import path from 'path';
import gutil from 'gulp-util';
import isJpg from 'is-jpg';
import pify from 'pify';
import getStream from 'get-stream';
import test from 'ava';
import m from './';

const fsP = pify(fs);

const createStream = async () => {
	const buf = await fsP.readFile('fixture.tar.gz');
	const stream = m();

	stream.end(new gutil.File({
		path: path.join(__dirname, 'fixture.tar.gz'),
		contents: buf
	}));

	return stream;
};

test('extract file', async t => {
	const stream = await createStream();
	const files = await getStream.array(stream);

	t.is(files[0].path, 'test.jpg');
	t.is(typeof files[0].stat, 'object');
	t.true(isJpg(files[0].contents));
});
