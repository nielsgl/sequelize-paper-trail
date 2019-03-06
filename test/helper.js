import { expect } from 'chai';
import { addPath } from 'app-module-path';
import path from 'path';

global.expect = expect;

addPath(path.resolve(__dirname, '../src'));
