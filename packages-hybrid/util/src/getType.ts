import {Object} from '@nlib/global';
export const getType = (function (objectToString) {
    return (object: any) => objectToString.call(object).slice(8, -1);
}(Object.prototype.toString));
