import type { MockType } from "tools";
export default function (mock: MockType) {
  mock.mock(/\/report\/test/, 'get', {})
}