import {Element} from 'xml-js';
export type WalkCallback = (...ancestors: Array<Element>) => void | boolean;
