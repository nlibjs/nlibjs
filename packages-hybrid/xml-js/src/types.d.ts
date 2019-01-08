import {Element} from 'xml-js';
export type WalkCallback = (...ancestors: Element[]) => void | boolean;
