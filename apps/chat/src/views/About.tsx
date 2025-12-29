import { type DefineComponent, defineComponent } from 'vue';
// import { useHidePageHeader } from '../hooks/useHidePageHeader';

const About: DefineComponent = defineComponent({
  name: 'AboutPage',
  setup() {
    // useHidePageHeader();

    return () => <div>About</div>;
  },
});

export default About;
