import {Element, getTextContent} from '@nlib/xml-js';
import {IRecord, IXref} from './types';

export const elementToRecord = ({
    name: elementName,
    elements: fields,
}: Element): IRecord | null => {
    if (elementName !== 'record' || !fields) {
        return null;
    }
    let name = '';
    let type = '';
    let subtype = '';
    let xref: IXref | null = null;
    for (const field of fields) {
        switch (field.name) {
        case 'name':
            name = getTextContent(field);
            break;
        case 'file':
            [type, subtype] = getTextContent(field).split('/');
            break;
        case 'xref': {
            if (field.attributes) {
                const {type, data} = field.attributes;
                xref = {
                    type: `${type}`,
                    data: `${data}`,
                };
            }
            break;
        }
        default:
            break;
        }
    }
    if (type && subtype && xref) {
        return {name, type, subtype, xref};
    }
    return null;
};
