<template>
  <button class="flex items-center justify-between w-full text-gray-700" style="max-width: 230px">
    <SelectDatepicker
      :key="reloadKey"
      :default-select="3"
      :text-visiblity="false"
      :date-ranges="dateRanges"
      @change="handleFilterDateRangeChange"
    />
  </button>
</template>

<script>
import { SelectDatepicker } from '@/components/Select';
import moment from 'moment';
import { i18n } from '../../../../public/locales/i18n';

export default {
  components: { SelectDatepicker },
  data() {
    return {
      dateRanges: {},
      reloadKey: 0,
    };
  },
  computed: {},
  watch: {
    '$i18n.locale': ['setDateRanges'],
  },
  created() {
    this.setDateRanges();
  },
  methods: {
    handleFilterDateRangeChange(dateRange) {
      this.strDate = moment(dateRange.startDate).format('YYYYMMDD');
      this.endDate = moment(dateRange.endDate).format('YYYYMMDD');
      this.$emit('handleSelectRangeDate', { strDate: this.strDate, endDate: this.endDate });
    },
    setDateRanges() {
      if (i18n.locale === 'ko') {
        this.dateRanges = {
          이번달: [moment().startOf('month').toDate(), moment().toDate()],
          지난달: [
            moment().subtract(1, 'month').startOf('month').toDate(),
            moment().subtract(1, 'month').endOf('month').toDate(),
          ],
          '최근 14일': [moment().subtract(14, 'days').toDate(), moment().toDate()],
          '최근 1개월': [moment().subtract(1, 'month').toDate(), moment().toDate()],
        };
        this.reloadKey += 1;
      } else {
        this.dateRanges = {
          'This month': [moment().startOf('month').toDate(), moment().toDate()],
          'Last month': [
            moment().subtract(1, 'month').startOf('month').toDate(),
            moment().subtract(1, 'month').endOf('month').toDate(),
          ],
          'Recent 14 days': [moment().subtract(14, 'days').toDate(), moment().toDate()],
          'Recent 1 month': [moment().subtract(1, 'month').toDate(), moment().toDate()],
        };
        this.reloadKey += 1;
      }
    },
  },
};
</script>

<style></style>
