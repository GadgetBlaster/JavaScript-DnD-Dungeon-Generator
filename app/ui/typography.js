
import { element } from '../utility/html.js';

export const em        = (label, attrs) => element('em', label, attrs);
export const paragraph = (label, attrs) => element('p', label, attrs);
export const small     = (label, attrs) => element('small', label, attrs);
export const strong    = (label, attrs) => element('strong', label, attrs);
export const subtitle  = (label, attrs) => element('h3', label, attrs);
export const title     = (label, attrs) => element('h2', label, attrs);
