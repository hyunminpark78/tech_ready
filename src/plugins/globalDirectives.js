import ClickOutside from 'vue-click-outside';
import phonenumber from '../directives/phonenumber';
import email from '../directives/email';
import sns from '../directives/sns';

export default {
  install(Vue) {
    Vue.directive(phonenumber.name, phonenumber);
    Vue.directive(email.name, email);
    Vue.directive(sns.name, sns);
    Vue.directive('click-outside', ClickOutside);
    Vue.directive('visible', visibleFunc);
  },
};

const visibleFunc = (elem, { value }) => {
  if (value === true) {
    elem.style.visibility = 'visible';
  } else if (value === false) {
    elem.style.visibility = 'hidden';
  }
};
