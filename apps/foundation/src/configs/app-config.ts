import type { cacheOptions } from 'wujie';

interface UrlObj {
  id: string;
  name: string;
  development: string;
  production: string;
}

type UrlType = keyof UrlObj;

const hostMap: Map<string, UrlObj> = new Map();

const init = async () => {
  return new Promise((resolve) => {
    const data = [
      { id: 'chat', name: 'chat', development: '//${location.hostname}:21001/', production: '${location.origin}/chat' },
      { id: 'report', name: 'report', development: '//${location.hostname}:21002/', production: '${location.origin}/chat' },
      { id: 'mark', name: 'mark', development: '//${location.hostname}:21003/', production: '${location.origin}/chat' },
      { id: 'visual-display', name: 'visual-display', development: '//${location.hostname}:21004/', production: '${location.origin}/chat' },
    ];
    hostMap.clear();
    for (const itm of data) {
      hostMap.set(itm.id, itm);
    }
    resolve(void 0);
  });
};

const getHost = (key: string) => {
  const urls = hostMap.get(key);
  if (!urls) return '';
  return (urls[process.env.NODE_ENV as UrlType] || '').replace(/\${.*?}/, (match) => {
    const str = match.substring(2, match.length - 1);
    try {
      return eval(str);
    } catch (err) {
      console.error(err);
      return str;
    }
  });
};

type appOptionType = Omit<cacheOptions, 'url'> & { url: string; label: string };
const getApps: () => Promise<appOptionType[]> = async () => {
  await init();
  const apps: appOptionType[] = [];
  for (const key of hostMap.keys()) {
    const value = hostMap.get(key)!;
    apps.push({
      name: value.id,
      label: value.name,
      url: getHost(value.id),
    });
  }
  return apps;
};

export default getApps;

export { getHost };

export type { appOptionType };
