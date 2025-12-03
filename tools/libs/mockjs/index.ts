import Mock from 'mockjs'

type MockType = typeof Mock
interface MockStartOption {
  callback?: (mock: MockType) => void
}

type MockOption = Mock.MockjsSetupSettings & MockStartOption

function MockStart(option: MockOption): void {
  Mock.setup({
    timeout: option.timeout || '200'
  })
  if (option.callback) {
    option.callback(Mock)
  }
}

export default Mock

export type {
  MockOption,
  MockType
}

export {
  MockStart
}