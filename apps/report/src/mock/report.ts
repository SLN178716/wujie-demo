import type { MockType } from '@packages/mock';
export default function (mock: MockType) {
  mock.mock(/\/report\/test/, 'get', {});
}
