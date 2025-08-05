import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Menu, type MenuProps } from 'antd';

import apps from '@/configs/app-config';

type MenuItem = Required<MenuProps>['items'][number];
export function Nav() {
  const items: MenuItem[] = [{
    label: '主页',
    key: ''
  }]
  apps.forEach(app => {
    items.push({
      label: app.label,
      key: app.name
    })
  })

  const [ current, setCurrent ] = useState('')

  const navigate = useNavigate()
  const MenuClick = (m: MenuItem) => {
    navigate(`/${m?.key || ''}`)
  }
  
  return (
    <Menu onClick={MenuClick} selectedKeys={[current]} mode="horizontal" items={items}></Menu>
  )
}