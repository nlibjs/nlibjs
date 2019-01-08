import {Boolean} from '@nlib/global';
import {Element} from 'xml-js';

type WalkCallback = (...ancestors: Element[]) => void | boolean;

const walkElementCore = (
    element: Element,
    callback: WalkCallback,
    previousAncestors: Element[],
): boolean => {
    const ancestors = [element, ...previousAncestors];
    const skip = Boolean(callback(...ancestors));
    if (!skip && element.elements) {
        for (const child of element.elements) {
            if (!walkElementCore(child, callback, ancestors)) {
                break;
            }
        }
    }
    return skip;
};

export const walkElement = (
    element: Element,
    callback: WalkCallback,
): void => {
    walkElementCore(element, callback, []);
};
