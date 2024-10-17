<template>
  <!-- sort -->
  <div class="sort-wrap pr0 mb-4">
    <div class="flex dashboard-card">
      <!-- col -->
      <div class="relative py-4 px-7 select-one">
        <div class="text-sm text-primary-600">{{ $t('common.select.contract') }}</div>
        <Select
          :data="selectContractOptions"
          :key-getter="(item) => item.ctrtId"
          :text-getter="(item) => item.ctrtNm"
          select-class="flex items-center justify-between w-full text-gray-700 font-bold"
          :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
          arrow-class="-mr-2"
          div-class="w-full"
          option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
          option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
          @click="handleFilterContractChange"
        />
      </div>
      <!-- //col -->
    </div>
  </div>
  <!-- //sort -->
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import moment from 'moment';
import Select from '@/components/Select';

export default {
  components: { Select },
  data() {
    return {
      isSearch: true,
    };
  },
  computed: {
    ...mapState('svcGrpMgmt', ['ctrt', 'filter']),
    ...mapGetters('svcGrpMgmt', ['selectContractOptions']),
  },
  created() {
    this.setCtgryFilter({});
    this.setSvcGrpFilter({});
    this.fetchRefresh({});
    this.fetchCtrt().then(() => {
      if (this.ctrt.length > 0) {
        this.setFilter({
          name: 'contract',
          payload: this.ctrt[0],
        });
        this.onSearch();
      }
    });
  },
  mounted() {
    const btnShows = document.querySelectorAll('.jsBtnShow1');
    btnShows.forEach((btnShow) => {
      btnShow.onclick = function () {
        if (this.parentNode.classList.contains('active')) {
          this.parentNode.classList.remove('active');
        } else {
          for (let i = 0; i < btnShows.length; i++) {
            btnShows[i].parentNode.classList.remove('active');
          }
          this.parentNode.classList.add('active');
        }
      };
    });
    const btn2Closes = document.querySelectorAll('.jsBtnClose2');
    btn2Closes.forEach((btn2Close) => {
      btn2Close.onclick = function () {
        this.parentNode.parentNode.classList.remove('active');
      };
    });
  },
  methods: {
    ...mapActions('svcGrpMgmt', [
      'fetchCtrt',
      'setFilter',
      'fetchSearch',
      'setCtgryFilter',
      'setSvcGrpFilter',
      'fetchRefresh',
    ]),
    handleFilterContractChange(contract) {
      this.setFilter({ name: 'contract', payload: contract });
      this.setCtgryFilter({});
      this.setSvcGrpFilter({});
      this.fetchRefresh({});
      this.onSearch();
    },
    onSearch() {
      this.isSearch = true;
      this.initSearch();
    },
    initSearch() {
      this.fetchSearch({ isSearch: { isSearch: this.isSearch } });
      this.isSearch = false;
    },
  },
};
</script>

<style></style>
