export interface Interceptor<V> {
  resolve: (v: V) => V | Promise<V>;
  reject?: (err: unknown) => unknown;
}

export type NullableInterceptor<V> = Interceptor<V> | null;

export class InterceptorManager<V> {
  private interceptors: NullableInterceptor<V>[] = [];

  use(resolve: Interceptor<V>['resolve'], reject?: Interceptor<V>['reject']): number {
    this.interceptors.push({ resolve, reject });
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
