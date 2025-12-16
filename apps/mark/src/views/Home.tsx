import { type DefineComponent, defineComponent } from 'vue';

const Home: DefineComponent = defineComponent({
  name: 'HomePage',
  setup() {
    return () => <div>Home</div>;
  },
});

export default Home;
