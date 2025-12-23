import type { cacheOptions } from 'wujie';

interface UrlObj {
  id: string;
  name: string;
  development: string;
  production: string;
}

type UrlType = keyof UrlObj;
type appOptionType = Omit<cacheOptions, 'url'> & { url: string; label: string };

const hostMap: Map<string, UrlObj> = new Map();
const apps: appOptionType[] = [];

const init = async () => {
  return new Promise((resolve) => {
    const data = [
      { id: 'chat', name: 'chat', development: '//${location.hostname}:21001/chat/', production: '${location.origin}/chat/' },
      { id: 'report', name: 'report', development: '//${location.hostname}:21002/report/', production: '${location.origin}/report/' },
      { id: 'mark', name: 'mark', development: '//${location.hostname}:21003/mark/', production: '${location.origin}/mark/' },
      { id: 'visual-display', name: 'visual-display', development: '//${location.hostname}:21004/visual-display/', production: '${location.origin}/visual-display/' },
    ];
    hostMap.clear();
    for (const itm of data) {
      hostMap.set(itm.id, itm);
    }
    for (const key of hostMap.keys()) {
      const value = hostMap.get(key)!;
      apps.push({
        name: value.id,
        label: value.name,
        url: getHost(value.id),
      });
    }
    resolve(apps);
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

await init();

export default apps;

export { getHost };

export type { appOptionType };
