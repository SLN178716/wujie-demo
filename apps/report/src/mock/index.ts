import { MockStart, type MockType, type MockOption } from '@packages/mock';
import ReportMock from './report';

if (import.meta.env.DEV) {
  console.log('开发环境');
  const option: MockOption = {
    timeout: '200-600',
    callback: (mock: MockType) => {
      ReportMock(mock);
    },
  };
  MockStart(option);
}
