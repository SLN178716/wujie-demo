import { PureComponent } from 'react';
import { Menu, type MenuProps } from 'antd';

import apps from '@/configs/app-config';
import useRouter, { type WithNavigateProps } from '@/hooks/useRouter';

type MenuItem = Required<MenuProps>['items'][number];

class Nav extends PureComponent<WithNavigateProps> {
  state: {
    items: MenuItem[];
    current: string;
  };

  constructor(props: WithNavigateProps) {
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
    apps.forEach((app) => {
      items.push({
        label: app.label,
        key: app.name,
      });
    });
    this.setState({
      items,
    });
  }

  MenuClick: MenuProps['onClick'] = (m) => {
    this.setState({
      current: m.key,
    });
    this.props.navigate(`/${m.key}`);
  };

  render() {
    return <Menu onClick={this.MenuClick} selectedKeys={[this.state.current]} mode="horizontal" items={this.state.items}></Menu>;
  }
}

export default useRouter(Nav);
