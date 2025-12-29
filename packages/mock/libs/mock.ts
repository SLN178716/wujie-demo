import Mock from 'mockjs';

import type { MockOption } from './types';

function MockStart(option: MockOption): void {
  Mock.setup({
    timeout: option.timeout || '200',
  });
  if (option.callback) {
    option.callback(Mock);
  }
}

export default Mock;

export { MockStart };
