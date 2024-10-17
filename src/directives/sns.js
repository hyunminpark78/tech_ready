export default {
  name: 'sns',
  data: null,
  bind(el) {
    if (el) {
      el.addEventListener('keypress', (e) => {
        const x = e.key;
        if (!/[0-9a-zA-Z._:@/-]/.test(x)) {
          e.preventDefault();
        }
      });
    }
  },
};
