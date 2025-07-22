import WujieReact from "wujie-react";
import { useLocation } from "react-router-dom";

import type { appOptionType } from '../../configs/app-config'

let _location_key = ''

export default function SubApp(option: appOptionType) {
  const { bus } = WujieReact
  const location = useLocation();
  const path = location.pathname.replace(`/${option.name}`, "").replace('/', '');
  // 发布通知子应用要跳转路由
  if (path && _location_key !== location.key) {
    _location_key = location.key
    bus.$emit(`${option.name}-router-change`, path)
  }
  const mixin = {
    height: '100%',
    width: '100%',
    sync: !path,
    afterMount: () => {
      // 子应用挂载时，上方发布早于子应用开始订阅
      // 导致接收不到，故在挂载后再发送一次
      bus.$emit(`${option.name}-router-change`, path)
    }
  }
  const props = {
    ...mixin,
    ...option
  }
  return (
    <WujieReact {...props}></WujieReact>
  );
}