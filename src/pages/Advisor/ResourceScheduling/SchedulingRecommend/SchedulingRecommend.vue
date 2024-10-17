<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <!-- header -->
      <SectionNewHeader
        title-class="flex items-center py-5"
        title2-class="font-bold"
        :main-icon="{ src: require('@/assets/images/chart.svg') }"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title2="$t('advisor.schedulingRecommend.title')"
        :title="$t('advisor.schedulingRecommend.title')"
      />
      <!-- header -->
      <Section>
        <SectionMain style="display: flex; flex-direction: column; gap: 20px">
          <MainFilter @filterChanged="onFilterChanged" />
          <SchedulingEstimatedSavings />
          <DetailTable @openPopup="openPopup"></DetailTable>
          <ComparisonPopup :visible="popup.visible" @closePopup="closePopup"></ComparisonPopup>
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import { MainFilter, DetailTable, ComparisonPopup, SchedulingEstimatedSavings } from './sections';
import { i18n } from '../../../../../public/locales/i18n';
import { Tooltip } from '@/pages/Advisor/components';
import { mapActions } from 'vuex';

export default {
  components: {
    SectionLnb,
    Section,
    SectionMain,
    SectionNewHeader,
    MainFilter,
    DetailTable,
    Tooltip,
    SchedulingEstimatedSavings,
    ComparisonPopup,
  },
  data() {
    return {
      tooltip: false,
      popup: {
        visible: false,
      },
    };
  },
  watch: {
    '$i18n.locale': 'setAllItem',
  },
  methods: {
    ...mapActions('resourceScheduling', ['fetchRecommendDetailData']),
    setAllItem() {
      if (i18n.locale === 'ko') {
        this.allItem = {
          id: 'checkAll',
          text: '전체',
        };
      } else {
        this.allItem = {
          id: 'checkAll',
          text: 'All',
        };
      }
    },
    closePopup() {
      this.popup.visible = false;
    },
    openPopup() {
      this.popup.visible = true;
    },
    onFilterChanged() {
      this.fetchRecommendDetailData(true);
    },
  },
};
</script>

<style lang="scss">
.primary {
  color: #00a5ed;
}

.pink {
  color: #fc5aa1 !important;
}

.content {
  position: absolute;
  left: initial;
  right: 0;
}

.chart-box {
  margin-top: 60px;
  padding: 30px 24px;

  & h3 {
    font-size: 24px;
    font-weight: 700;
    color: #000;

    & > span {
      color: #666;
      font-size: 18px;
      font-weight: 500;
    }
  }
}

.ag-cell {
  font-size: 14px;
}
</style>
