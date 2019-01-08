import {Element} from 'xml-js';

const elementWalkerCore = function* (
    element: Element,
    previousAncestors: Element[],
): IterableIterator<Element[]> {
    const ancestors = [element, ...previousAncestors];
    yield ancestors;
    if (element.elements) {
        for (const child of element.elements) {
            yield* elementWalkerCore(child, ancestors);
        }
    }
};

export const elementWalker = (element: Element) => elementWalkerCore(element, []);
