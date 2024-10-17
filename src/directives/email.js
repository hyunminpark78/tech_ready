export default {
  name: 'email',
  data: null,
  bind(el) {
    if (el) {
      el.addEventListener('keypress', (e) => {
        const x = e.key;
        if (
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            x
          )
        ) {
          e.preventDefault();
        }
      });
    }
  },
};
