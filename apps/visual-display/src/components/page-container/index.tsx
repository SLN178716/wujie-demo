import { type DefineComponent, defineComponent } from 'vue';

const PageContainer: DefineComponent = defineComponent({
  name: 'PageContainer',
  setup() {
    return () => (
      <>
        <el-aside>
          <sub-menu></sub-menu>
        </el-aside>
        <el-main></el-main>
      </>
    );
  },
});

export default PageContainer;
