<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.mainSupport')"
        :title2="$t('menu.notices')"
        :main-icon="{ src: require('@/assets/images/ico-sr.svg') }"
      />
      <div class="box-wrap">
        <div class="title pr30">
          <!-- search -->
          <div class="search-wrap flex">
            <div class="flex-1">
              <SearchForm :value="searchString" @input="setSearchString" @search="search" />
            </div>
          </div>
          <!-- //search -->
        </div>
        <!-- //module -->
        <div>
          <table class="w-full bg-white border-t border-primary-200 board-table">
            <thead class="font-bold text-xs- text-primary-600">
              <tr class="border-b border-primary-200 bg-primary-300" style="height: 53px">
                <th class="px-8 py-4 text-left">{{ $t('support.title') }}</th>
                <th class="w-1/6 px-8 py-4">{{ $t('support.check') }}</th>
                <th class="w-1/6 px-8 py-4">{{ $t('support.registrationDate') }}</th>
              </tr>
            </thead>

            <tbody class="text-sm">
              <tr
                v-for="n in list"
                :key="n.bbmId"
                :class="n.pinned ? 'border-b' : 'border-b border-primary-200 hover:bg-primary-300'"
                style="height: 53px"
              >
                <td class="px-8">
                  <RouterLink :to="`notice/${n.bbmId}`" class="flex">
                    <img v-if="n.pinned" src="@/assets/images/ico-pin.svg" alt="." class="mr-2" />
                    {{ n.titNm }}
                  </RouterLink>
                </td>
                <td class="px-8 text-center">{{ n.viewCnt | number }}</td>
                <td class="px-8 text-center">{{ n.frstRegDtm | toDateDot }}</td>
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
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import boardListMixin from '../boardListMixin';
import Paginate from '@/components/Paginate.vue';
import { SearchForm } from '@/components/Board';
import TabNavigation from '../TabNavigation.vue';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';

export default {
  components: { Section, SectionLnb, SectionNewHeader, SectionMain, Paginate, SearchForm, TabNavigation },
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
