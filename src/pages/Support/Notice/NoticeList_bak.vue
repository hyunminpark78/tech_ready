<template>
  <main class="pt-8 pb-12 main">
    <div class="container">
      <div class="flex items-center py-5">
        <img src="@/assets/images/ico-sr.svg" alt="." class="mr-2" />
        <span class="text-2xl--">고객지원</span>
      </div>

      <div class="overflow-hidden bg-white border rounded-lg border-primary-200 dashboard-card">
        <TabNavigation />

        <div class="px-8 bg-white">
          <SearchForm :value="searchString" @input="setSearchString" @search="search" />
        </div>

        <table class="w-full bg-white border-t border-primary-200 board-table">
          <thead class="font-bold text-xs- text-primary-600">
            <tr class="border-b border-primary-200 bg-primary-300">
              <th class="px-8 py-4 text-left">제목</th>
              <th class="w-1/6 px-8 py-4">조회</th>
              <th class="w-1/6 px-8 py-4">등록일</th>
            </tr>
          </thead>

          <tbody class="text-sm">
            <tr
              v-for="n in list"
              :key="n.bbmId"
              :class="n.pinned ? 'border-b' : 'border-b border-primary-200 hover:bg-primary-300'"
            >
              <td class="px-8 py-4">
                <RouterLink :to="`notice/${n.bbmId}`" class="flex items-center">
                  <img v-if="n.pinned" src="@/assets/images/ico-pin.svg" alt="." class="mr-2" />
                  {{ n.titNm }}
                </RouterLink>
              </td>
              <td class="px-8 py-4 text-center">{{ n.viewCnt | number }}</td>
              <td class="px-8 py-4 text-center">{{ n.frstRegDtm | toDateDot }}</td>
            </tr>
            <tr v-if="list.length === 0">
              <td colspan="3">
                <div class="flex flex-col items-center justify-center" style="height: 293px">
                  <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
                  <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <Paginate
          v-if="totalCount > 0"
          :class="totalCount < 3 && 'pb-24'"
          :total-cnt="totalCount"
          :total-page-cnt="10"
          :page-no="pageNo"
          :page-size="paging.pageSize"
          @changepage="pageChange"
        />
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import boardListMixin from '../boardListMixin';
import Paginate from '@/components/Paginate.vue';
import { SearchForm } from '@/components/Board';
import TabNavigation from '../TabNavigation.vue';

export default {
  components: { Paginate, SearchForm, TabNavigation },
  mixins: [boardListMixin],
  computed: {
    ...mapState('notice', ['paging', 'searchString', 'totalCount', 'list']),
  },
  watch: {
    pageNo() {
      this.fetch();
    },
    query() {
      this.fetch();
    },
  },
  created() {
    this.setSearchString(this.query);
    this.fetch();
  },
  methods: {
    ...mapActions('notice', ['setSearchString', 'fetchList']),
    fetch() {
      this.fetchList({
        paging: { ...this.paging, pageNo: this.pageNo },
        searching: { searchString: this.query },
      });
    },
  },
};
</script>
