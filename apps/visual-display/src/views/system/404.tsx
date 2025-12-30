import { type DefineComponent, defineComponent } from 'vue';

const NotFound: DefineComponent = defineComponent({
  name: 'NotFound',
  setup() {
    return () => (
      <>
        <div>404</div>
      </>
    );
  },
});

export default NotFound;
