import option from '@packages/prettier';

const opt = {
  ...option,
  overrides: [
    {
      files: '*.vue',
      options: { parser: 'vue' },
    },
  ],
};

export default opt;
