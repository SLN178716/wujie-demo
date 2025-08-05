import type { cacheOptions } from "wujie";

const hostMap: Map<string, string> = new Map([
  ['//127.0.0.1:21001/', '//127.0.0.1:21001/'],
  ['//127.0.0.1:21002/', '//127.0.0.1:21002/']
])
const getHost = (key: string) => {
  if (process.env.NODE_ENV === "production") return hostMap.get(key) || ''
  return key
}

type appOptionType = Omit<cacheOptions, 'url'> & { url: string, label: string } 
const apps: appOptionType[] = [
  // chat子应用
  {
    label: 'chat',
    name: "chat",
    url: getHost("//127.0.0.1:21001/"),
  },
  // report子应用
  {
    label: 'report',
    name: "report",
    url: getHost("//127.0.0.1:21002/"),
  }
];

export default apps

export {
  getHost
}

export type {
  appOptionType
}
