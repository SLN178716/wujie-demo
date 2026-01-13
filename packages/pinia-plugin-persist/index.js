'use strict';
import prod from './dist/pinia-plugin-persist.esm-bundler.prod.js';
import dev from './dist/pinia-plugin-persist.esm-bundler.js';

export default import.meta.env.DEV ? dev : prod;
