'use strict';
import prod from './dist/pdf-view.prod.js';
import dev from './dist/pdf-view.js';

export default import.meta.env.DEV ? dev : prod;
