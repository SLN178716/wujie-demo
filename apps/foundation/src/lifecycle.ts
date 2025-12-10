const lifecycles = {
  beforeLoad: (appWindow: Window) => console.log(`${appWindow} beforeLoad 生命周期`),
  beforeMount: (appWindow: Window) => console.log(`${appWindow} beforeMount 生命周期`),
  afterMount: (appWindow: Window) => console.log(`${appWindow} afterMount 生命周期`),
  beforeUnmount: (appWindow: Window) => console.log(`${appWindow} beforeUnmount 生命周期`),
  afterUnmount: (appWindow: Window) => console.log(`${appWindow} afterUnmount 生命周期`),
  activated: (appWindow: Window) => console.log(`${appWindow} activated 生命周期`),
  deactivated: (appWindow: Window) => console.log(`${appWindow} deactivated 生命周期`),
  loadError: (url: string, e: Error) => console.log(`${url} 加载失败`, e),
};

export default lifecycles;
