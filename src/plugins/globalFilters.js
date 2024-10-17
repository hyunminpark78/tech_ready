import moment from 'moment';
import { numberWithCommas } from 'openitlibrary/src/library/regexp';

export default {
  install(Vue) {
    Vue.filter('toDateTime', (value, format = 'YYYY-MM-DD HH:mm:ss') => moment(value).format(format));
    Vue.filter('toDateTimeUTC', (value, format = 'YYYY-MM-DD HH:mm:ss') => moment.utc(value).format(format));
    Vue.filter('toDate', (value, format = 'YYYY-MM-DD') => moment(value).format(format));
    Vue.filter('date', (value, format = 'YYYY.MM.DD HH:mm') => moment(value).format(format));
    Vue.filter('number', (value, floatSize = 0) =>
      Number.isNaN(Number(value)) ? '-' : numberWithCommas(parseFloat(value).toFixed(floatSize))
    );
    Vue.filter('numberToFixed', (value, size = 2) =>
      Number.isNaN(Number(value)) ? '-' : parseFloat(value).toFixed(size)
    );
    Vue.filter('toYearMonth', (value, format = 'YY년 MM월') => moment.utc(value).locale('ko').format(format));
    Vue.filter('toMonthKo', (value, format = 'MM월') => moment.utc(value).locale('ko').format(format));
    Vue.filter('toMonthEn', (value, format = 'MMMM') => moment.utc(value).locale('en').format(format));
    Vue.filter('toDateDotKo', (value, format = 'YYYY.MM.DD') => moment.utc(value).locale('ko').format(format));
    Vue.filter('toDateDotEn', (value, format = 'MMM.DD.YYYY') => moment.utc(value).locale('en').format(format));
    Vue.filter('bytesToMb', (value) => (value / 1024 ** 2).toFixed(3) + 'MB');
  },
};
