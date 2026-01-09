export interface Interceptor<V> {
  fulfilled: (v: V) => V | Promise<V>;
  rejected?: (err: unknown) => unknown;
}

export type NullableInterceptor<V> = Interceptor<V> | null;

export class InterceptorManager<V> {
  private interceptors: NullableInterceptor<V>[] = [];

  use(fulfilled: Interceptor<V>['fulfilled'], rejected?: Interceptor<V>['rejected']): number {
    this.interceptors.push({ fulfilled, rejected });
    return this.interceptors.length - 1;
  }

  eject(id: number) {
    if (this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }

  // 重写Symbol.iterator，实现遍历时过滤无效拦截器
  *[Symbol.iterator]() {
    for (const itm of this.interceptors) {
      if (itm) {
        yield itm;
      }
    }
  }
}
