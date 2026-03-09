import { Element, isText } from 'domhandler';

export function hasClass(element: Element, className: string): boolean {
    return element.attribs.class?.split(/\s+/).includes(className) ?? false;
}

export function textContent(element: Element): string {
    return element.childNodes.length > 0 && isText(element.childNodes[0]) ? element.childNodes[0].data : "";
}
