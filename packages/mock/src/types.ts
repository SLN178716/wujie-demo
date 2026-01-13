import Mock from 'mockjs';

export type MockType = typeof Mock;

interface MockStartOption {
  callback?: (mock: MockType) => void;
}

export type MockOption = Mock.MockjsSetupSettings & MockStartOption;
