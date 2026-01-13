export function throttle(func: Function, wait: number) {
  let lastTime = 0;
  return function (this: any, ...args: any[]) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}
