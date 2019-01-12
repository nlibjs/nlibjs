import {Element} from 'xml-js';

type Walker = IterableIterator<Array<Element>>;

const elementWalkerCore = function* (
    element: Element,
    previousAncestors: Array<Element>,
): Walker {
    const ancestors = [element, ...previousAncestors];
    yield ancestors;
    if (element.elements) {
        for (const child of element.elements) {
            yield* elementWalkerCore(child, ancestors);
        }
    }
};

export const elementWalker = (element: Element): Walker => elementWalkerCore(element, []);
