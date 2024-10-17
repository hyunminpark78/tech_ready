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

          <RadioGroup
            ref="categoryRadioGroup"
            class="flex pb-4"
            :active-classes="['text-white', 'bg-primary-400', 'border-primary-400']"
            :standard-classes="['bg-white', 'text-primary-400', 'border-primary-400']"
            :active-index="categoryActiveIndex"
            @change="handleCategoryChange"
          >
            <button
              v-for="c in categories"
              :key="c.value"
              :value="c.value"
              class="px-2.5 py-1 text-sm font-bold border rounded-sm h-8 mr-3"
            >
              {{ c.text }}
            </button>
          </RadioGroup>
        </div>

        <table class="w-full bg-white border-t border-primary-200 board-table">
          <thead class="font-bold text-xs- text-primary-600">
            <tr class="border-b border-primary-200">
              <th class="w-1/6 px-8 py-4">분류</th>
              <th class="px-8 py-4 text-left">제목</th>
            </tr>
          </thead>

          <tbody class="text-sm">
            <tr v-for="faq in list" :key="faq.bbmId" class="border-b border-primary-200 hover:bg-primary-300">
              <td class="px-8 py-4 text-center">{{ faq.bbmSepCdNm }}</td>
              <td class="px-8 py-4">
                <RouterLink :to="`faq/${faq.bbmId}`" class="flex items-center">{{ faq.titNm }}</RouterLink>
              </td>
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
import RadioGroup from '@/components/RadioGroup.vue';
import { SearchForm } from '@/components/Board';
import TabNavigation from '../TabNavigation.vue';

export default {
  components: { Paginate, RadioGroup, SearchForm, TabNavigation },
  mixins: [boardListMixin],
  props: {
    category: {
      type: String,
      default: 'ALL',
    },
  },
  computed: {
    ...mapState('faq', ['categories', 'paging', 'searchString', 'totalCount', 'list']),
    categoryActiveIndex() {
      return this.categories.findIndex((item) => item.value === this.category);
    },
  },
  watch: {
    category(newValue) {
      this.$refs.categoryRadioGroup.setActiveValue(newValue);
      this.fetch();
    },
    pageNo() {
      this.fetch();
    },
    query() {
      this.fetch();
    },
  },
  created() {
    this.setSearchString(this.query);
    this.fetchCategories();
    this.fetch();
  },
  methods: {
    ...mapActions('faq', ['fetchCategories', 'setSearchString', 'fetchList']),
    fetch() {
      this.fetchList({
        bbmSepCd: this.category === 'ALL' ? null : this.category,
        paging: { ...this.paging, pageNo: this.pageNo },
        searching: { searchString: this.searchString },
      });
    },
    handleCategoryChange(index) {
      this.$router.push({
        path: this.$route.path,
        query: {
          q: this.$route.query.q,
          bbmSepCd: this.categories[index].value,
        },
      });
    },
  },
};
</script>
