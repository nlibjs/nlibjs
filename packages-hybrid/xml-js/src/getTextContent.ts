import {Element} from 'xml-js';
import {elementWalker} from './elementWalker';

export const getTextContent = (element: Element): string => {
    const fragments: Array<string> = [];
    for (const [{type, text = ''}] of elementWalker(element)) {
        if (type === 'text') {
            fragments.push(`${text}`);
        }
    }
    return fragments.join('');
};
