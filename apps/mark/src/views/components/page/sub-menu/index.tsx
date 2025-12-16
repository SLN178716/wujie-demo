import { type DefineComponent, defineComponent } from 'vue';

const SubMenu: DefineComponent = defineComponent({
  name: 'SubMenu',
  setup() {
    return () => <div>SubMenu</div>;
  },
});

export default SubMenu;
