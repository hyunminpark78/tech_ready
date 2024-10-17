export default {
  name: 'phonenumber',
  data: null,
  bind(el) {
    if (el) {
      el.addEventListener('keydown', (e) => {
        if (e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 46) return;
        e.target.value = e.target.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '');
      });

      el.addEventListener('keypress', (e) => {
        const x = e.key;

        if (/[a-zA-Z]/.test(x) || / /.test(x) || /[\{\}\[\]\/?.,;:|\)*~`!^\-<>@\#$%&\\\=\(\'\"]/gi.test(x)) {
          e.preventDefault();
        }
      });
    }
  },
};
