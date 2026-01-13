'use strict';
import prod from './dist/pinia-plugin-persist.prod.js';
import dev from './dist/pinia-plugin-persist.js';

export default import.meta.env.DEV ? dev : prod;
