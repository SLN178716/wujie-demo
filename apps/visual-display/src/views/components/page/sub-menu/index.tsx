import { type DefineComponent, defineComponent } from "vue";

const SubMenu: DefineComponent = defineComponent({
  name: "SubMenu",
  setup() {
    const handleOpen = () => {};
    const handleClose = () => {};
    return () => (
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        onOpen={handleOpen}
        onClose={handleClose}
      ></el-menu>
    );
  },
});

export default SubMenu;
