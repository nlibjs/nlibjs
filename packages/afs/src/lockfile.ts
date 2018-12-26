import * as lockfile from 'lockfile';
import {promisify} from 'util';

export const lock = promisify(lockfile.lock);
export const lockSync = lockfile.lockSync;
export const unlock = promisify(lockfile.unlock);
export const unlockSync = lockfile.unlockSync;
export const check = promisify(lockfile.check);
export const checkSync = lockfile.checkSync;
