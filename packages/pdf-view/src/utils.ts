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

export function debounce(func: Function, wait: number) {
  let timer: number | undefined;

  return function (this: any, ...args: any[]) {
    // 清除之前的定时器
    if (timer !== undefined && timer !== null) {
      clearTimeout(timer);
    }

    // 设置新的定时器
    timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
