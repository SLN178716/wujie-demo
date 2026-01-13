'use strict';
import prod from './dist/pdf-view.esm-bundler.prod.js';
import dev from './dist/pdf-view.esm-bundler.js';

export default import.meta.env.DEV ? dev : prod;
