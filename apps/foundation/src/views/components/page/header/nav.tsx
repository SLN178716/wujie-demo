import { PureComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, type MenuProps } from 'antd';

import getApps from '@/configs/app-config';

type MenuItem = Required<MenuProps>['items'][number];
export class Nav extends PureComponent<unknown> {
  state: {
    items: MenuItem[];
    current: string;
  };

  constructor(props: unknown) {
    super(props);
    this.state = {
      items: [],
      current: '',
    };
  }

  async componentDidMount() {
    const items: MenuItem[] = [
      {
        label: '主页',
        key: '',
      },
    ];
    const apps = await getApps();
    apps.forEach((app) => {
      items.push({
        label: app.label,
        key: app.name,
      });
    });
    console.log(items);
    this.setState({
      items,
    });
  }

  MenuClick: MenuProps['onClick'] = (m) => {
    const navigate = useNavigate();
    this.setState({
      current: m.key,
    });
    navigate(`/${m.key}`);
  };

  render() {
    return <Menu onClick={this.MenuClick} selectedKeys={[this.state.current]} mode="horizontal" items={this.state.items}></Menu>;
  }
}
