<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.mainSupport')"
        :title2="$t('menu.faqs')"
        :main-icon="{ src: require('@/assets/images/ico-sr.svg') }"
      />
      <div class="box-wrap">
        <div class="title pr30">
          <!-- search -->
          <div class="search-wrap flex">
            <div class="flex-1">
              <SearchForm :value="searchString" @input="setSearchString" @search="search" />
              <RadioGroup
                v-if="$i18n.locale === 'ko'"
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
              <RadioGroup
                v-if="$i18n.locale === 'en'"
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
                  {{ c.enText }}
                </button>
              </RadioGroup>
            </div>
          </div>
        </div>
        <!-- //search -->
        <div>
          <table class="w-full bg-white border-t border-primary-200 board-table">
            <thead class="font-bold text-xs- text-primary-600">
              <tr class="border-b border-primary-200">
                <th class="w-1/6 px-8 py-4">{{ $t('support.classification') }}</th>
                <th class="px-8 py-4 text-left">{{ $t('support.title') }}</th>
              </tr>
            </thead>

            <tbody class="text-sm">
              <tr v-for="faq in list" :key="faq.bbmId" class="border-b border-primary-200 hover:bg-primary-300">
                <td class="px-8 py-4 text-center">{{ faq.bbmSepCdNm }}</td>
                <td class="px-8 py-4">
                  <RouterLink :to="`faq/${faq.bbmId}`" class="flex">{{ faq.titNm }}</RouterLink>
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
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import boardListMixin from '../boardListMixin';
import Paginate from '@/components/Paginate.vue';
import RadioGroup from '@/components/RadioGroup.vue';
import { SearchForm } from '@/components/Board';
import TabNavigation from '../TabNavigation.vue';
import { SectionLnb, SectionNewHeader } from '@/components/Section';

export default {
  components: { SectionNewHeader, SectionLnb, Paginate, RadioGroup, SearchForm, TabNavigation },
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
  async created() {
    await this.fetchCategories();
    await this.setSearchString(this.query);
    await this.fetch();
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
