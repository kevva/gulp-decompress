import {promises as fs} from 'fs';
import path from 'path';
import Vinyl from 'vinyl';
import isJpg from 'is-jpg';
import getStream from 'get-stream';
import test from 'ava';
import gulpDecompress from '.';

const createStream = async () => {
	const buf = await fs.readFile('fixture.tar.gz');
	const stream = gulpDecompress();

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

test('ensure symlinks are valid', async t => {
	const stream = await createStream();
	const files = await getStream.array(stream);

	t.is(files[3].path, 'folder/batman.jpg');
	t.true(isJpg(files[3].contents));
	t.is(files[4].path, 'folder/batsymlink.jpg');
	t.is(files[4]._symlink, 'batman.jpg');
	t.is(files[4].contents, null);
	t.false(files[4].stat.isDirectory());
	t.true(files[4].stat.isSymbolicLink());
});
