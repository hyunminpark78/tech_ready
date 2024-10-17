import { mapState } from 'vuex';
import { i18n } from '../../../../../public/locales/i18n';
export default {
  data() {
    // TODO: GCP 기능 추가 시 항목 값 변경 필요!
    return {
      filterTitles: {},
      titles: {},
      fields: {
        AWS: 'OnDmnd',
        AZURE: 'OnDmnd',
        // AZURE: 'Payg', // TODO: API 제공 시 변경 필요!
        GCP: 'Others',
      },
    };
  },
  computed: {
    ...mapState('costOpti', ['filter']),
    getFilterTitle() {
      return this.filterTitles[this.filter.cspTypCd];
    },
    getTitle() {
      return this.titles[this.filter.cspTypCd];
    },
    getField() {
      return this.fields[this.filter.cspTypCd];
    },
  },
  created() {
    this.setFilterTitles();
    this.setTitles();
  },
  watch: {
    '$i18n.locale': ['setFilterTitles', 'setTitles'],
  },
  methods: {
    setFilterTitles() {
      if (i18n.locale === 'ko') {
        this.filterTitles = {
          AWS: '계정',
          AZURE: 'subscription',
          GCP: '계정',
        };
      } else {
        this.filterTitles = {
          AWS: 'accounts',
          AZURE: 'subscription',
          GCP: 'accounts',
        };
      }
    },
    setTitles() {
      if (i18n.locale === 'ko') {
        this.titles = {
          AWS: '온디맨드',
          AZURE: '종량제',
          GCP: '가변형',
        };
      } else {
        this.titles = {
          AWS: 'On-Demand',
          AZURE: 'PAYG',
          GCP: 'Variable type',
        };
      }
    },
  },
};
