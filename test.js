import fs from 'fs';
import path from 'path';
import Vinyl from 'vinyl';
import isJpg from 'is-jpg';
import pify from 'pify';
import getStream from 'get-stream';
import test from 'ava';
import m from './';

const fsP = pify(fs);

const createStream = async () => {
	const buf = await fsP.readFile('fixture.tar.gz');
	const stream = m();

	stream.end(new Vinyl({
		path: path.join(__dirname, 'fixture.tar.gz'),
		contents: buf
	}));

	return stream;
};

test('extract file', async t => {
	const stream = await createStream();
	const files = await getStream.array(stream);

	t.is(files[1].path, 'test.jpg');
	t.is(typeof files[1].stat, 'object');
	t.true(isJpg(files[1].contents));
});

test('ensure directory contents is `null`', async t => {
	const stream = await createStream();
	const files = await getStream.array(stream);

	t.is(files[0].path, 'test');
	t.is(files[0].contents, null);
	t.true(files[0].stat.isDirectory());
});
