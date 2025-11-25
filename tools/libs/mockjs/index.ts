import Mock from 'mockjs'


interface MockStartOption {
  callback?: (mock: typeof Mock) => void
}

type MockOption = Mock.MockjsSetupSettings & MockStartOption

function MockStart(option: MockOption): void {
  Mock.setup({
    timeout: option.timeout || '200'
  })
}

export default Mock

export type {
  MockOption
}

export {
  MockStart
}