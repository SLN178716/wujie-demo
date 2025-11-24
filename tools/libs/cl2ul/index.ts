class Cl2Ul {
  obj: any
  constructor(v: any) {
    this.obj = new Proxy(v, {
      get(target, key) {
        if (Object.hasOwn(target, key)) return target[key]
      }
    })
  }
  
}