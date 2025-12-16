import type { cacheOptions } from 'wujie';

const hostMap: Map<string, string> = new Map([
  ['//127.0.0.1:21001/', '/chat'],
  ['//127.0.0.1:21002/', '/report'],
  ['//127.0.0.1:21003/', '/mark'],
  ['//127.0.0.1:21004/', '/visual-display'],
]);
const getHost = (key: string) => {
  if (process.env.NODE_ENV === 'production') return hostMap.get(key) || '';
  return key;
};

type appOptionType = Omit<cacheOptions, 'url'> & { url: string; label: string };
const apps: appOptionType[] = [
  // chat子应用
  {
    label: 'chat',
    name: 'chat',
    url: getHost('//127.0.0.1:21001/'),
  },
  // report子应用
  {
    label: 'report',
    name: 'report',
    url: getHost('//127.0.0.1:21002/'),
  },
  // mark子应用
  {
    label: 'mark',
    name: 'mark',
    url: getHost('//127.0.0.1:21003/'),
  },
  // visual-display子应用
  {
    label: 'visual-display',
    name: 'visual-display',
    url: getHost('//127.0.0.1:21004/'),
  },
];

export default apps;

export { getHost };

export type { appOptionType };
