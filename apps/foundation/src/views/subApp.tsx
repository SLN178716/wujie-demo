import WujieReact from "wujie-react";
import { useLocation } from "react-router-dom";

import type { appOptionType } from '../configs/app-config'

let _location_key = ''

export default function SubApp(option: appOptionType) {
  const { bus } = WujieReact
  const location = useLocation();
  const path = location.pathname.replace(`/${option.name}`, "");
  // 告诉子应用要跳转哪个路由
  if (path && _location_key !== location.key) {
    _location_key = location.key
    bus.$emit(`${option.name}-router-change`, path)
  }
  const mixin = {
    height: '100%',
    width: '100%',
    sync: !path
  }
  const props = {
    ...mixin,
    ...option
  }
  return (
    <WujieReact {...props}></WujieReact>
  );
}