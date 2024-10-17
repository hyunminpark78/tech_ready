import globalFilters from './globalFilters';
import globalDirectives from './globalDirectives';
import globalComponents from './globalComponents';
import globalValidateRules from './globalValidateRules';

export default {
  install(Vue) {
    Vue.use(globalFilters);
    Vue.use(globalDirectives);
    Vue.use(globalComponents);
    Vue.use(globalValidateRules);
  },
};
