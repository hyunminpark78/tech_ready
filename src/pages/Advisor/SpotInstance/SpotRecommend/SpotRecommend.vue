<template>
  <div id="spotRecommendation" class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <!-- header -->
      <SectionNewHeader
        title-class="flex items-center py-5"
        title2-class="font-bold"
        :main-icon="{ src: require('@/assets/images/chart.svg') }"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title2="$t('advisor.recommendation')"
        :title="$t('advisor.recommendation')"
        :display-exchg-rate="displayExchgRate"
      />
      <!-- header -->
      <Section>
        <SectionMain class="recommendMainSection">
          <MainFilter @filterChanged="onFilterChanged" @onCloudChanged="onFilterChanged" />
          <!-- tab -->
          <div class="flex items-center tab-one">
            <button
              :ref="recommendType.sameType"
              class="
                tab-item
                flex
                items-center
                justify-center
                w-1/3
                bg-white
                border border-primary-200
                font-normal
                text-base
                rounded-tl-lg rounded-bl-lg
              "
              :class="{
                clicked: category === recommendType.sameType,
              }"
              :disabled="category === recommendType.sameType"
              @click="() => updateCategory(recommendType.sameType)"
            >
              {{ $t('advisor.recommendationOption.sameType') }}
            </button>
            <button
              :ref="recommendType.priceFirst"
              class="
                tab-item
                flex
                items-center
                justify-center
                w-1/3
                bg-white
                border border-l-0 border-gray-300
                font-normal
                text-base
              "
              :class="{
                clicked: category === recommendType.priceFirst,
              }"
              :disabled="category === recommendType.priceFirst"
              @click="() => updateCategory(recommendType.priceFirst)"
            >
              {{ $t('advisor.recommendationOption.costPriority') }}
            </button>

            <button
              :ref="recommendType.stabilityFirst"
              class="
                tab-item
                flex
                items-center
                justify-center
                w-1/3
                bg-white
                border border-l-0 border-gray-300
                font-normal
                text-base
                rounded-tr-lg rounded-br-lg
              "
              :class="{
                clicked: category === recommendType.stabilityFirst,
              }"
              :disabled="category === recommendType.stabilityFirst"
              @click="() => updateCategory(recommendType.stabilityFirst)"
            >
              {{ $t('advisor.recommendationOption.stabilityFirst') }}
            </button>
            <Tooltip :left-position="true">
              <div class="ti" style="font-weight: 700">{{ $t('advisor.recommendationOption.title') }}</div>
              <div class="ls">
                <span class="primary">{{ $t('advisor.recommendationOption.sameType') }}</span> :
                {{ $t('advisor.recommendationOption.sameTypeDes') }}
              </div>

              <div class="ls">
                <span class="primary">{{ $t('advisor.recommendationOption.costPriority') }}</span> :
                {{ $t('advisor.recommendationOption.costPriorityDes') }}
              </div>

              <div class="ls">
                <span class="primary">{{ $t('advisor.recommendationOption.stabilityFirst') }}</span> :
                {{ $t('advisor.recommendationOption.stabilityFirstDes') }}
              </div>
            </Tooltip>
          </div>
          <!-- //tab -->
          <SpotMonthlyEstimatedSavings></SpotMonthlyEstimatedSavings>
          <DetailTable @openPopup="openPopup"></DetailTable>
          <ComparisonPopup
            :recommend-option="category"
            :visible="popup.visible"
            @closePopup="closePopup"
          ></ComparisonPopup>
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import { MainFilter, DetailTable, SpotMonthlyEstimatedSavings, ComparisonPopup } from './sections';
import { i18n } from '../../../../../public/locales/i18n';
import { Tooltip } from '@/pages/Advisor/components';
import { RECOMMEND_TYPE } from '../SpotInstanceEnum';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  components: {
    SectionLnb,
    Section,
    SectionMain,
    SectionNewHeader,
    MainFilter,
    DetailTable,
    Tooltip,
    SpotMonthlyEstimatedSavings,
    ComparisonPopup,
  },
  data() {
    return {
      tooltip: false,
      popup: {
        visible: false,
      },
      recommendType: RECOMMEND_TYPE,
      defaultCategory: RECOMMEND_TYPE.sameType,
    };
  },
  computed: {
    ...mapState('spotAdvisor', {
      category: 'category',
    }),
    ...mapGetters('spotAdvisor', ['cspTypCd', 'displayExchgRate']),
  },
  watch: {
    cspTypCd: function () {
      this.initCategory();
    },
  },
  created() {
    this.initCategory();
  },
  methods: {
    ...mapActions('spotAdvisor', ['fetchSpotRecommendSummary', 'fetchRecommendDetailData', 'fetchCategory']),
    updateCategory(category) {
      this.fetchCategory(category);
      this.fetchSpotRecommendSummary(true);
      this.fetchRecommendDetailData(true);
    },
    closePopup() {
      this.popup.visible = false;
    },
    openPopup() {
      this.popup.visible = true;
    },
    initCategory() {
      this.fetchCategory(this.defaultCategory);
    },
    onFilterChanged() {
      this.fetchSpotRecommendSummary(true);
      this.fetchRecommendDetailData(true);
    },
  },
};
</script>

<style lang="scss">
#spotRecommendation {
  .primary {
    color: #00a5ed;
  }
  .recommendMainSection {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .tab-item {
    padding: 16px 28px;
    color: #666666;
  }
  .clicked {
    color: #fff;
  }
}
</style>
