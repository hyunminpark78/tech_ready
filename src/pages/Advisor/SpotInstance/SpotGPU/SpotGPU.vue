<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        title2-class="font-bold"
        :main-icon="{ src: require('@/assets/images/chart.svg') }"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        title="GPU Spot"
        title2="GPU Spot"
      />
      <Section>
        <SectionMain style="display: flex; flex-direction: column; gap: 20px">
          <div style="margin-top: 0; position: relative">
            <div class="flex" style="z-index: 22; position: relative">
              <SelectCloudFilter
                ref="cloud"
                style-parent="width: fit-content; height: auto; border-radius: 8px; padding-right: 0px"
                class="jh_special"
                :csp-typ-cd-from-parent="filter.cspTypCd"
                :is-disabled="true"
              ></SelectCloudFilter>
              <div
                v-for="tab in translatedTabs"
                :key="tab.name"
                :class="['gpu-tab', { active: currentTab === tab.name }]"
                @click="switchTab(tab.name)"
              >
                {{ tab.translatedLabel }}
              </div>
              <div class="flex items-center">
                <Tooltip>
                  <div style="font-weight: 700" class="ti">
                    {{ $t('advisor.gpuSPot.gpuSpotTooltip.title') }}
                  </div>
                  <div class="ls">
                    <span class="primary">{{ $t('advisor.gpuSPot.gpuSpotTooltip.placementScore') }}</span> :
                    {{ $t('advisor.gpuSPot.gpuSpotTooltip.placementScoreDes') }}
                  </div>
                  <div class="ls">
                    <span class="primary">{{ $t('advisor.gpuSPot.gpuSpotTooltip.priceAndFrequency') }}</span> :
                    {{ $t('advisor.gpuSPot.gpuSpotTooltip.priceAndFrequencyDes') }}
                  </div>
                  <div class="ls">
                    <span class="primary">{{ $t('advisor.gpuSPot.gpuSpotTooltip.gpuUsageStatus') }}</span> :
                    {{ $t('advisor.gpuSPot.gpuSpotTooltip.gpuUsageStatusDes') }}
                  </div>
                </Tooltip>
              </div>
              <div style="flex: 1"></div>
            </div>
            <div class="flex" style="position: absolute; z-index: 10; top: 60px; left: 20px">
              <button
                v-if="currentTab !== 'useStatus'"
                class="flex items-center justify-center"
                :style="{
                  borderRadius: '16px',
                  border: '1px solid #00a5ed',
                  backgroundColor: isOpenFilter ? '#fff' : '#fff',
                  padding: '0px 12px',
                  gap: '0px',
                  width: '56px',
                  height: '56px',
                  boxShadow: '0px 2px 20px rgba(0,165,237,0.12)',
                  border: '0px solid #d4d4d4',
                }"
                @click="filtering"
              >
                <img
                  :src="
                    isOpenFilter
                      ? require('@/assets/images/ico-filter-open-white.svg')
                      : require('@/assets/images/ico-filter-open.svg')
                  "
                  alt=""
                  style="margin-top: 2px"
                />
              </button>
              <SpotGPUFilter
                @close-filter="closeFilter"
                @apply-filter="applyFilter"
                :current-tab="currentTab"
                v-if="currentTab !== 'useStatus' && currentTab === 'interruptionFrequency' && isOpenFilter"
              />
              <SpotGPUFilter2
                @close-filter="closeFilter"
                @apply-filter="applyFilter"
                :current-tab="currentTab"
                v-if="currentTab !== 'useStatus' && currentTab !== 'interruptionFrequency' && isOpenFilter2"
              />
            </div>
            <div id="geo-map" ref="gpuSpotMapChart" class="geo-map relative"></div>
            <div
              v-if="!interruptionTabeVisible && !usageTabTableTooltipVisible"
              class="spot-gpu-panel-container"
              style="width: fit-content"
            >
              <div class="title-panel">
                {{ $t('advisor.gpuSPot.spotScoreNote.title') }}
              </div>
              <table class="spot-gpu-panel">
                <thead class="header-panel">
                  <tr>
                    <th class="spot-gpu-header">
                      <p style="padding: 0 20px; border-right: 1px solid rgba(26, 227, 187, 0.2)">
                        {{ $t('advisor.gpuSPot.spotScoreNote.numberOfInstances') }}
                      </p>
                    </th>
                    <th class="spot-gpu-header">
                      <p style="padding: 0 20px; border-right: 1px solid rgba(26, 227, 187, 0.2)">vCPU</p>
                    </th>
                    <th class="spot-gpu-header">
                      <p style="padding: 0 20px; border-right: 1px solid rgba(26, 227, 187, 0.2)">
                        {{ $t('advisor.gpuSPot.spotScoreNote.memory') }}
                      </p>
                    </th>
                    <th class="spot-gpu-header">
                      <p style="padding: 0 20px; border-right: 1px solid rgba(26, 227, 187, 0.2)">
                        {{ $t('advisor.detailTable.CPUArchitecture') }}
                      </p>
                    </th>
                    <th class="spot-gpu-header">
                      <p style="padding: 0 20px">
                        {{ $t('advisor.detailTable.acceleratorType') }}
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody class="body-panel">
                  <tr>
                    <td class="spot-gpu-cell" style="text-align: center">10개</td>
                    <td class="spot-gpu-cell" style="text-align: center">4~</td>
                    <td class="spot-gpu-cell" style="text-align: center">8~</td>
                    <td class="spot-gpu-cell" style="text-align: center">
                      <div style="display: flex; flex-direction: column">
                        <p>x86_64</p>
                        <p>arm64</p>
                      </div>
                    </td>
                    <td class="spot-gpu-cell" style="text-align: center">
                      <div style="display: flex; flex-direction: column">
                        <p>A100</p>
                        <p>H100</p>
                        <p>V100</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="interruptionTabeVisible" class="spot-gpu-panel-container" style="width: fit-content">
              <div class="title-panel">기준 정보</div>
              <table class="spot-gpu-panel">
                <thead class="header-panel">
                  <tr>
                    <th class="spot-gpu-header">
                      <p style="padding: 0 20px; border-right: 1px solid rgba(26, 227, 187, 0.2)">인스턴스 타입</p>
                    </th>
                    <th class="spot-gpu-header">
                      <p style="padding: 0 20px; border-right: 1px solid rgba(26, 227, 187, 0.2)">운영체제</p>
                    </th>
                    <th class="spot-gpu-header">
                      <p style="padding: 0 20px">기준일시</p>
                    </th>
                  </tr>
                </thead>
                <tbody class="body-panel">
                  <tr>
                    <td class="spot-gpu-cell" style="text-align: center">
                      {{ selectedType === 0 ? 'g4dn.xlarge' : 'g5.2xlarge' }}
                    </td>
                    <td class="spot-gpu-cell" style="text-align: center">Linux/UNIX</td>
                    <td class="spot-gpu-cell" style="text-align: center">{{ getFormattedYesterdayDate }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="plmi" @click="tablebn"></div>
            <div v-if="usageTabTableTooltipVisible" class="spot-gpu-panel-container" style="width: fit-content">
              <div class="title-panel">
                {{
                  $t('advisor.gpuSPot.gpuUsageTooltip.gpuUsageHistory') +
                  ' (' +
                  formatDate(usageTableSummaryData.baseDate) +
                  ')'
                }}
                <a
                  href="#"
                  style="font-size: 13px; font-weight: normal; cursor: pointer; color: gray; margin-left: 10px"
                  >추천 상세 보기 &gt;</a
                >
              </div>
              <table class="spot-gpu-panel">
                <thead class="header-panel">
                  <tr>
                    <th class="spot-gpu-header">
                      <p style="padding: 0 20px; border-right: 1px solid rgba(26, 227, 187, 0.2)">
                        {{ $t('advisor.gpuSPot.gpuUsageTooltip.totalInstances') }}
                      </p>
                    </th>
                    <th class="spot-gpu-header">
                      <p style="padding: 0 20px; border-right: 1px solid rgba(26, 227, 187, 0.2)">
                        {{ $t('advisor.gpuSPot.gpuUsageTooltip.spotInstance') }}
                      </p>
                    </th>
                    <th class="spot-gpu-header">
                      <p style="padding: 0 20px; border-right: 1px solid rgba(26, 227, 187, 0.2)">
                        {{ $t('advisor.gpuSPot.gpuUsageTooltip.onDemandInstance') }}
                      </p>
                    </th>
                    <th class="spot-gpu-header">
                      <p style="padding: 0 20px">{{ $t('advisor.gpuSPot.gpuUsageTooltip.totalUse') }}</p>
                    </th>
                  </tr>
                </thead>
                <tbody class="body-panel">
                  <tr>
                    <td class="spot-gpu-cell" style="text-align: center">
                      {{ usageTableSummaryData.instanceCountTotal }}개
                    </td>
                    <td class="spot-gpu-cell" style="text-align: center">
                      {{ usageTableSummaryData.spotCountTotal }}개 ({{
                        usageTableSummaryData.spotTotalPercent.toFixed(0)
                      }}%)
                    </td>
                    <td class="spot-gpu-cell" style="text-align: center">
                      {{ usageTableSummaryData.onDemandCountTotal }}개 ({{
                        usageTableSummaryData.onDemandTotalPercent.toFixed(0)
                      }}%)
                    </td>
                    <td class="spot-gpu-cell" style="text-align: center">{{ usageTableSummaryData.regionCount }}개</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="isShowPopup && usageTabTooltipVisible" class="spot-usage-detail-tooltip" :style="popupPosition">
              <div class="tooltip-title-conttainer">
                <span class="title">{{ usageTabToolTip.region }}</span>
              </div>
              <div class="popup-content">
                <label>{{ $t('advisor.gpuSPot.gpuUsageTooltip.availabilityZone') }}</label>
                <p style="max-width: 80%; overflow: auto; white-space: nowrap">
                  {{ usageTabToolTip.availabilityZones.join(', ') }}
                </p>
              </div>
              <div class="popup-content">
                <label>{{ $t('advisor.gpuSPot.gpuUsageTooltip.numberOfIntances') }}</label>
                <p>{{ usageTabToolTip.instanceCountTotal }} {{ $t('advisor.gpuSPot.gpuUsageTooltip.unit') }}</p>
              </div>
              <div class="popup-content">
                <label>{{ $t('advisor.gpuSPot.gpuUsageTooltip.instanceDistribution') }}</label>
                <p>
                  {{ $t('advisor.gpuSPot.gpuUsageTooltip.onDemand') }} {{ usageTabToolTip.onDemandCountTotal }}
                  {{ $t('advisor.gpuSPot.gpuUsageTooltip.unit') }}
                  <span>({{ usageTabToolTip.onDemandTotalPercent.toFixed(2) }})%</span> / Spot
                  {{ usageTabToolTip.spotCountTotal }} {{ $t('advisor.gpuSPot.gpuUsageTooltip.unit')
                  }}<span>({{ usageTabToolTip.spotTotalPercent.toFixed(2) }})%</span>
                </p>
              </div>
              <div class="popup-content" style="border-bottom: none">
                <label>{{ $t('advisor.gpuSPot.gpuUsageTooltip.instanceType') }}</label>
                <div class="flex gap-4">
                  <p>{{ usageTabToolTip.instanceTypes.slice(0, 2).join(', ') }}...</p>
                  <div class="popup-instance-type-select" @click="showInstanceType()">
                    <span>
                      {{ $t('advisor.gpuSPot.gpuUsageTooltip.viewAll') }} {{ usageTabToolTip.instanceTypes.length }}
                    </span>
                    <img :src="require('@/assets/images/arrow-sm-01.svg')" alt="" style="margin-top: 2px" />
                  </div>
                </div>
              </div>
              <div v-if="isShowInstanceType" class="instance-type" @click="showInstanceType()">
                <p v-for="(item, index) in usageTabToolTip.instanceTypes" :key="index">{{ item }}</p>
              </div>
            </div>
          </div>
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import Section, { SectionLnb, SectionMain, SectionNewHeader } from '@/components/Section';
import { Tooltip } from '@/pages/Advisor/components';
import SelectCloudFilter from '@/components/Select/SelectCloudFilter2.vue';
import { mapState } from 'vuex';
import resourceOptiService from '@/services/resourceOptiService';
import { i18n } from '../../../../../public/locales/i18n';
import SpotGPUFilter from '@/pages/Advisor/SpotInstance/SpotGPU/SpotGPUFilter.vue';
import SpotGPUFilter2 from '@/pages/Advisor/SpotInstance/SpotGPU/SpotGPUFilter2.vue';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import spotGPUService from '@/services/spotGPUService';
import demoData from '../../../../../public/locales/gpudemo.json';
import moment from 'moment';
import reset from '../../../../assets/images/restart-icon.svg';

export default {
  components: {
    SectionLnb,
    Section,
    SectionMain,
    Tooltip,
    SelectCloudFilter,
    SectionNewHeader,
    SpotGPUFilter,
    SpotGPUFilter2,
  },
  data() {
    return {
      tab: 1,
      isOpenFilter: false,
      isOpenFilter2: false,
      hideOpenFilter: false,
      usageTabTooltipVisible: false,
      usageTabTableTooltipVisible: false,
      interruptionTabeVisible: true,
      batchScoreResultTableVisible: false,
      currentTab: 'interruptionFrequency',
      isShowInstanceType: false,
      isShowPopup: false,
      popupPosition: {
        left: '0px',
        top: '0px',
      },

      tabs: [
        { name: 'interruptionFrequency', label: 'advisor.gpuSPot.spotPriceAndFrequency' },
        { name: 'batchScore', label: 'advisor.gpuSPot.spotPlacementScore' },
        { name: 'useStatus', label: 'advisor.gpuSPot.GPUSpotUsage' },
      ],
      geoChart: null,
      colorSet: null,
      imageSeries: null,
      defaultTooltipData: null,
      homeLongitude: -163,
      usageTableSummaryData: {
        instanceCountTotal: 0,
        spotCountTotal: 0,
        onDemandCountTotal: 0,
        regionCount: 0,
        spotTotalPercent: 0,
        onDemandTotalPercent: 0,
        baseDate: new Date(),
      },
      usageTabToolTip: {},
      selectedType: 0,
    };
  },
  computed: {
    ...mapState('resourceOpti', {
      filter: 'filter',
    }),
    translatedTabs() {
      return this.tabs.map((tab) => ({
        ...tab,
        translatedLabel: this.$t(tab.label),
      }));
    },
    getFormattedYesterdayDate() {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      // Get the year, month, and day
      const year = yesterday.getFullYear();
      const month = String(yesterday.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const day = String(yesterday.getDate()).padStart(2, '0');

      // Return the formatted date string
      return `${year}.${month}.${day}`;
    },
  },
  watch: {
    '$i18n.locale': 'exchgRateSearch',
    usageTabTooltipVisible(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.isShowPopup = false;
      }
    },
  },
  created() {
    this.exchgRateSearch();
    am4core.useTheme(am4themes_animated);
  },
  async mounted() {
    this.fetchAndUpdateMapData();
    this.createChart('geo-map');

    // mock data while api is error
    this.updateTooltipContent();
    const responseData = this.usageMockData();
    this.updateTableSummaryData(responseData.usageStatus);
  },
  beforeDestroy() {
    if (this.geoChart) {
      this.geoChart.dispose();
    }
  },
  methods: {
    showInstanceType() {
      this.isShowInstanceType = !this.isShowInstanceType;
    },
    resetVisibilityStates() {
      this.hideOpenFilter = false;
      this.usageTabTooltipVisible = false;
      this.usageTabTableTooltipVisible = false;
      this.interruptionTabeVisible = false;
      this.batchScoreResultTableVisible = false;
    },
    closeFilter() {
      this.isOpenFilter = false;
      this.batchScoreResultTableVisible = true;
    },
    applyFilter() {
      this.selectedType === 0 ? (this.selectedType = 1) : (this.selectedType = 0);
      this.updateTooltipContent();
    },
    switchTab(tabName) {
      this.currentTab = tabName;
      this.isOpenFilter = false;

      this.resetVisibilityStates();

      if (tabName === 'useStatus') {
        this.hideOpenFilter = true;
        this.usageTabTooltipVisible = true;
        this.usageTabTableTooltipVisible = true;
      } else if (tabName === 'interruptionFrequency') {
        this.interruptionTabeVisible = true;
      }

      this.goHome();
      this.updateTooltipContent();
    },
    updateTooltipContent() {
      const responseData = this.usageMockData();
      this.updateImageSeries(this.currentTab === 'useStatus' ? responseData.usageStatus : demoData.locationScore);

      if (this.currentTab === 'useStatus') {
        this.updateUseStatusTooltip(responseData.usageStatus);
      } else if (this.currentTab === 'batchScore') {
        // this.updateImageSeries(demoData.locationScore);
        this.updateImageSeries(this.usageMockData().batchScore);

        this.updateBatchScoreTooltip();
      } else if (this.currentTab === 'interruptionFrequency') {
        if (this.selectedType === 0) {
          this.updateImageSeries(demoData.irruptionPrice);
          this.updateInterruptionTooltip(demoData.irruptionPrice);
        } else {
          this.updateImageSeries(demoData.irruptionPriceG5);
          this.updateInterruptionTooltip(demoData.irruptionPriceG5);
        }
      }
    },
    updateUseStatusTooltip(data) {
      this.imageSeries.mapImages.template.adapter.add('tooltipHTML', (html, target) => {
        let data = target.dataItem.dataContext;

        var availabilityZones = '12345';

        // Replace placeholders in the tooltip HTML
        html = html.replace(
          '<div class="tooltip_area_avail" data-spot-avail></div>',
          `<div class="tooltip_area_avail">${availabilityZones}</div>`
        );

        return html;
      });

      // Define the structure of the tooltip
      this.imageSeries.mapImages.template.tooltipHTML = `
  <div class="tooltip-spot">
    <h4>{region}</h4>
    <span style="font-size:12px;font-weight:400;color:#333;">ap-northeast-2c</span>
    <table>
      <tbody>
      <tr>
        <th></th>
        <th>인스턴스 사용액</th>
        
        <th>인스턴스 개수</th>
        </tr>
        <tr>
          <th>합계</th>
          <td>￦3,452,049</td>
          <td>40개</td>
          </tr>
          <tr>
          <th>온디맨드</th>
          <td>￦2,948,392 (65%)</td>
          <td>30개 (87%)</td>
          </tr>
          <tr>
            <th>Spot</th>
            <td><b>￦503,657 (35%)</b></td> 
            <td><b>10개 (13%)</b></td>  
          </tr>
        </tbody>
    </table>
   
  </div>
`;
    },
    displayIrruptionRate(data) {
      if (data < 5) {
        return '<5%';
      } else if (data >= 5 && data < 11) {
        return '5-10%';
      } else if (data >= 10 && data < 16) {
        return '10-15%';
      } else if (data >= 15 && data < 21) {
        return '15-20%';
      } else if (data >= 20) {
        return '>20%';
      } else {
        return '';
      }
    },
    updateInterruptionTooltip(data) {
      // Use a single adapter to handle all dynamic content
      this.imageSeries.mapImages.template.adapter.add('tooltipHTML', (html, target) => {
        let data = target.dataItem.dataContext;
        if (data.availabilityZones && data.spotPrice && data.savingRate) {
          // Availability Zones
          let availabilityZones = data.availabilityZones
            .map((zone) => {
              return `
          <div class="tooltip_info">
            <p>${zone}</p>
          </div>`;
            })
            .join('');

          // Spot Prices
          let spotPrice = data.spotPrice
            .map((price) => {
              return `
          <div class="tooltip_info">
            <p>￦${price}</p>
          </div>`;
            })
            .join('');

          // Saving Rates
          let savingRate = data.savingRate
            .map((rate) => {
              return `
          <div class="tooltip_info">
            <p>${rate}%</p>
          </div>`;
            })
            .join('');

          // Replace placeholders in the tooltip HTML
          html = html.replace(
            '<div class="tooltip_area_avail" data-spot-avail></div>',
            `<div class="tooltip_area_avail">${availabilityZones}</div>`
          );

          html = html.replace(
            '<div class="tooltip_area_spot" data-spot-spotPrice></div>',
            `<div class="tooltip_area_spot">${spotPrice}</div>`
          );

          html = html.replace(
            '<div class="tooltip_area_saving" data-spot-saving></div>',
            `<div class="tooltip_area_saving">${savingRate}</div>`
          );
          html = html.replace(
            '<div class="tooltip_irruptionRate" data-irruptionRate></div>',
            `<div class="tooltip_irruptionRate">${this.displayIrruptionRate(data.irruptionRate * 5)}</div>`
          );
        }
        return html;
      });

      // Define the structure of the tooltip
      this.imageSeries.mapImages.template.tooltipHTML = `
    <div class="tooltip-spot">
      <h4>{region}</h4>
      <div class="tooltip_content">
        <label>인스턴스 타입</label>
        <p>{instanceType}</p>
      </div>
      <div class="tooltip_content">
        <label>중단빈도</label>
        <div class="tooltip_irruptionRate" data-irruptionRate></div>
      </div>
      <div class="tooltip_content" style="border-bottom: none !important;margin-bottom:10px;">
        <label>온디맨드 비용(h)</label>
        <p>￦{onDemandBill}</p>
      </div>

      <div class="tooltip_area">
        <div>
          <h4>가용영역</h4>
          <div class="tooltip_area_avail" data-spot-avail></div>
        </div>

        <div>
          <h4>Spot 비용 (h)</h4>
          <div class="tooltip_area_spot" data-spot-spotPrice></div>
        </div>

        <div>
          <h4>예상 절감율</h4>
          <div class="tooltip_area_saving" data-spot-saving></div>
        </div>
      </div>
    </div>
  `;
    },

    updateTableSummaryData(responseData) {
      responseData.forEach((item) => {
        this.usageTableSummaryData.instanceCountTotal += item.instanceCountTotal;
        this.usageTableSummaryData.spotCountTotal += item.spotCountTotal;
        this.usageTableSummaryData.onDemandCountTotal += item.onDemandCountTotal;
        this.usageTableSummaryData.regionCount += 1;
      });
      this.usageTableSummaryData.spotTotalPercent =
        (this.usageTableSummaryData.spotCountTotal / this.usageTableSummaryData.instanceCountTotal) * 100;
      this.usageTableSummaryData.onDemandTotalPercent =
        (this.usageTableSummaryData.onDemandCountTotal / this.usageTableSummaryData.instanceCountTotal) * 100;
    },
    handleRecommendDetailBtnClick() {
      this.$router.push('spot/recommend');
    },
    updateBatchScoreTooltip() {
      //       this.imageSeries.mapImages.template.tooltipHTML = `
      // <div class="tooltip-spot" style="width: 200px;">
      //     <h4>{region}</h4>
      //   <div class="tooltip_content">
      //       ${this.getTooltipContent('가용영역')}
      //       ${this.getTooltipContent('배치 점수 순위', '공동 4위')}
      //       ${this.getTooltipContent('배치 점수', '4')}
      //     </div></div>`;
      this.imageSeries.mapImages.template.tooltipHTML = `
<div class="tooltip-spot" style="border-bottom:0px solid #d4d4d4;padding-bottom:0px;">
    <h4>{region}</h4>
  <div class="tooltip_content" style="font-size:12px;font-weight:400;color:#4a4a4a;border-bottom:0px solid #d4d4d4 !important;">
    가용영역 <label style="font-size:12px;font-weight:700;color:#00A5ED !important;margin-left:23px;">{availabilityZone}</label>
  </div>
  
    </div>`;
    },
    getFamilyTags(instanceTypeFamily) {
      if (!instanceTypeFamily) return '';
      return instanceTypeFamily.map((family) => `<span class="tag">${family.toUpperCase()}</span>`).join('');
    },
    getTooltipDetail(title, value) {
      return `
    <div class="tooltip-detail-info-container">
      <div class="title">${title}</div>
      <div class="value">${value}</div>
    </div>`;
    },
    getTooltipContent(labelKey, value) {
      /// ${this.$t(`advisor.gpuSPot.gpuSpotMapChart.${labelKey}`)}:
      return `
    <div class="tooltip-detail-info-container">
      <div class="title">${labelKey}:</div>
      <div class="value">${value}</div>
    </div>`;
    },
    async exchgRateSearch() {
      const result = await resourceOptiService.fetchExchRate(this.exchgRateSrcCd, this.curcyNm, this.exchgRateStdDt);
      const exchgRateStdDt = result.data.data.exchgRateStdDt;
      const krwExchgRate = result.data.data.krwExchgRate;
      const year = exchgRateStdDt.slice(0, 4);
      const month = exchgRateStdDt.slice(4, 6);
      const day = exchgRateStdDt.slice(6, 8);
      const formattedDate = year + '년 ' + month + '월 ' + day + '일';
      const viewKrwExchgRate = document.querySelectorAll('.exchRate');
      const viewExchgRateStdDt = document.querySelector('.excRateTip');
      const textNode = viewExchgRateStdDt.firstChild;
      viewKrwExchgRate[0].textContent = `${this.$t('optimization.appliedExchangeRate')}: ￦` + krwExchgRate;
      if (i18n.locale === 'ko') {
        textNode.nodeValue = 'Upbit 환율 ' + formattedDate;
      } else {
        textNode.nodeValue = moment().format('MMM.DD.YYYY') + ' (Upbit)';
      }
    },
    createChart(idChart) {
      /* Chart code */
      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end

      this.colorSet = new am4core.ColorSet();

      // Create map instance
      this.geoChart = am4core.create(idChart, am4maps.MapChart);
      let chart = this.geoChart;

      chart.geodata = am4geodata_worldLow;
      //chart.background.fill = am4core.color('#1e2224');
      chart.background.fillOpacity = 1;

      // Set projection
      chart.projection = new am4maps.projections.Miller();
      chart.homeZoomLevel = 0.8;
      // chart.minZoomLevel = 0.5;
      // chart.maxZoomLevel = 3;
      chart.deltaLongitude = this.homeLongitude;

      // Set min and max zoom level (optional)
      chart.minZoomLevel = 0.5;
      chart.maxZoomLevel = 3;

      // Disabling zoom and pan on a Map Chart
      chart.seriesContainer.events.disableType('doublehit');
      chart.chartContainer.background.events.disableType('doublehit');

      //polygonSeries.mapPolygons.template.fill = am4core.color("#e3ebf1");
      //chart.background.fill = am4core.color('#e3ebf1');

      // Add zoom control
      chart.zoomControl = new am4maps.ZoomControl();
      chart.zoomControl.align = 'right';
      chart.zoomControl.valign = 'top';
      chart.zoomControl.plusButton.background.fill = 'white';
      chart.zoomControl.minusButton.background.fill = 'white';
      chart.zoomControl.minusButton.background.strokeWidth = '0.4';
      chart.zoomControl.minusButton.background.stroke = '#25b5f3';
      chart.zoomControl.plusButton.background.strokeWidth = '0.4';
      chart.zoomControl.plusButton.background.stroke = '#25b5f3';
      chart.zoomControl.plusButton.label.fill = '#1b97cd';
      chart.zoomControl.minusButton.label.fill = '#1b97cd';
      let homeButton = new am4core.Button();
      homeButton.events.on('hit', function () {
        chart.goHome();
      });
      console.log(homeButton);
      homeButton.icon = new am4core.Sprite();
      homeButton.padding(7, 5, 7, 5);
      homeButton.margin(0, 0, 4, 0);
      homeButton.width = 30;
      homeButton.background.fill = am4core.color('rgba(0,0,0,0)');
      homeButton.background.strokeWidth = '0';
      homeButton.icon.path =
        'M19.9,8.8c-.4-2.3-1.6-4.4-3.4-6-1.8-1.5-4.1-2.4-6.4-2.4-.6,0-1,.4-1,1s.4,1,1,1c1.9,0,3.7.7,5.2,1.9,1.4,1.2,2.4,2.9,2.7,4.8.3,1.9,0,3.8-1,5.4-1,1.6-2.5,2.9-4.2,3.5-1.8.6-3.7.6-5.5,0-1.8-.7-3.2-1.9-4.2-3.6-.9-1.6-1.2-3.6-.9-5.4.3-1.4.9-2.7,1.9-3.8v1.8c0,.6.4,1,1,1s1-.4,1-1V3c0-.6-.4-1-1-1H1C.4,2,0,2.4,0,3s.4,1,1,1h1.4C1.3,5.3.5,6.9.2,8.6c-.4,2.3,0,4.7,1.1,6.8,1.2,2.1,3,3.6,5.2,4.5,2.2.8,4.6.9,6.9,0,2.2-.8,4.1-2.3,5.3-4.4,1.2-2,1.6-4.4,1.2-6.8Z';
      // homeButton.marginBottom = 500;
      homeButton.icon.fill = '#00A5ED';
      homeButton.parent = chart.zoomControl;
      homeButton.insertBefore(chart.zoomControl.plusButton);

      // Create map polygon series
      var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
      polygonSeries.exclude = ['AQ'];
      polygonSeries.useGeodata = true;

      // Configure series
      let polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = '';
      polygonTemplate.polygon.fillOpacity = 0.6;

      // Create hover state and set alternative fill color
      // let hs = polygonTemplate.states.create('hover');
      // hs.properties.fill = chart.colors.getIndex(0);

      // imageSeries.mapImages.template.propertyFields.url = 'url';
      // imageSeries.fill = am4core.color('#000');
      this.imageSeries = chart.series.push(new am4maps.MapImageSeries());
      this.imageSeries.mapImages.template.propertyFields.longitude = 'longitude';
      this.imageSeries.mapImages.template.propertyFields.latitude = 'latitude';
      //this.imageSeries.tooltip.background.stroke = am4core.color('rgba(26, 227, 187, 0.2)');
      //this.imageSeries.tooltip.background.strokeWidth = 1;
      this.imageSeries.tooltip.background.cornerRadius = 10;
      //this.imageSeries.tooltip.background.strokeOpacity = 1;
      this.imageSeries.tooltip.getFillFromObject = false;
      this.imageSeries.tooltip.background.fill = am4core.color('rgba(255, 255, 255, 1)');
      polygonTemplate.fill = am4core.color('#C7D0D4');
      // var zoomOut = chart.tooltipContainer.createChild(am4core.Image);
      // // zoomOut.disabled = true;
      // // var zoomImage = chart.tooltipContainer.createChild(am4core.Image);
      // zoomOut.href = reset;
      // zoomOut.width = 30;
      // zoomOut.height = 30;
      //
      // // zoomOut.interactionsEnabled = false;
      // zoomOut.align = 'right';
      // zoomOut.valign = 'top';
      // zoomOut.margin(20, 20, 20, 20);
      // zoomOut.events.on('hit', function () {
      //   chart.zoomToGeoPoint({ latitude: -163, longitude: 0 }, 0.8);
      //   // zoomOut.hide();
      // });
      // // zoomOut.hide();
      //
      // zoomOut.cursorOverStyle = am4core.MouseCursorStyle.pointer;

      // Assuming `imageSeries` is defined and contains circles for cities
      this.imageSeries.mapImages.template.events.on('hit', function (event) {
        const regionSereies = event.target.dataItem.dataContext;
        const azList = event.target.dataItem.dataContext.availabilityZone;

        if (!regionSereies) return;

        if (azList) {
          chart.goHome(); // Reset the chart view
          // zoomOut.hide(); // Hide the zoom out control

          // Move the chart to the coordinates of the clicked region
        }
        chart.zoomToGeoPoint({ latitude: regionSereies.latitude, longitude: regionSereies.longitude }, 5); // Adjust zoom level as needed

        zoomOut.show();
      });

      this.imageSeries.mapImages.template.events.on('hit', (event) => {
        const { x, y } = event.svgPoint;
        const data = event.target.dataItem.dataContext;
        this.usageTabToolTip.region = data.region;
        this.usageTabToolTip.availabilityZones = data.availabilityZones;
        this.usageTabToolTip.instanceCountTotal = data.instanceCountTotal;
        this.usageTabToolTip.spotCountTotal = data.spotCountTotal;
        this.usageTabToolTip.onDemandCountTotal = data.onDemandCountTotal;
        this.usageTabToolTip.instanceTypes = data.instanceTypes;
        this.usageTabToolTip.formattedDate = this.getFormattedYesterdayDate;
        this.usageTabToolTip.spotTotalPercent = data.spotTotalPercent;
        this.usageTabToolTip.onDemandTotalPercent = data.onDemandTotalPercent;
        this.popupPosition = {
          left: `${x + 50}px`,
          top: `${y + 50}px`,
        };
        this.isShowPopup = !this.isShowPopup;
      });

      this.imageSeries.mapImages.template.adapter.add('tooltipHTML', (html, target) => {
        let data = target.dataItem.dataContext;

        // Format avgSavingsRate to one decimal place if it exists
        if (data.avgSavingsRate !== undefined) {
          let formattedSavingsRate = parseFloat(data.avgSavingsRate).toFixed(1);
          html = html.replace('{avgSavingsRate}', formattedSavingsRate);
        }

        // Process instanceTypeFamily as before
        if (data.instanceTypeFamily) {
          let familyTags = data.instanceTypeFamily
            .map((family) => `<span class="tag">${family.toUpperCase()}</span>`)
            .join('');
          html = html.replace(
            '<div class="tags-container" data-instance-family></div>',
            `<div class="tags-container">${familyTags}</div>`
          );
        }

        return html;
      });

      this.imageSeries.mapImages.template.propertyFields.url = 'url';

      polygonSeries.data = [
        {
          id: 'NZ',
          zoomLevel: 12,
          zoomGeoPoint: {
            latitude: -41,
            longitude: 173,
          },
        },
        {
          id: 'RU',
          zoomLevel: 2.5,
          zoomGeoPoint: {
            latitude: 62,
            longitude: 96,
          },
        },
      ];
      this.chartZoom();
      return chart;
    },
    async fetchAndUpdateMapData() {
      try {
        const response = await spotGPUService.fetchSpotGPUDefault({ standardDate: '20240905' });

        this.defaultTooltipData = response.data;
        this.updateImageSeries(this.defaultTooltipData);
      } catch (error) {
        console.error('Error fetching map data:', error);
      }
    },
    updateImageSeries(data) {
      if (this.currentTab === 'interruptionFrequency') {
        const mappedData = this.mapData(data);
        this.imageSeries.data = mappedData;
        this.createCircles();
      } else if (this.currentTab === 'batchScore') {
        const sortedData = this.sortDataScore(data);
        const mappedData = this.mapScoreDataWithScales(sortedData);
        this.imageSeries.data = mappedData;
        this.createCircles();
      } else {
        const sortedData = this.sortDataByAzCount(data);
        const mappedData = this.mapDataWithScales(sortedData);
        this.imageSeries.data = mappedData;
        this.createCircles();
      }
    },
    sortDataByAzCount: function (data) {
      return data.sort((a, b) => b.azCountPerRegion - a.azCountPerRegion);
    },
    sortDataScore: function (data) {
      return data.sort((a, b) => b.score - a.score);
    },
    mapDataWithScales: function (data) {
      return data.map((item, index) => {
        const { outerScale, innerScale } = this.getScales(index);
        return {
          ...item,
          outerScale,
          innerScale,
          color: this.colorSet.next(),
          // fill: am4core.color('#1AE3BB'),
          // stroke: am4core.color('#1AE3BB'),
        };
      });
    },
    mapScoreDataWithScales: function (data) {
      return data.map((item, index) => {
        let outerScale = 16;
        let innerScale = 8;
        if (item.ranking === 1) {
          outerScale = 48;
          innerScale = 24;
        } else if (item.ranking === 2) {
          outerScale = 32;
          innerScale = 16;
        }

        return {
          ...item,
          outerScale,
          innerScale,
          color: this.colorSet.next(),
          // fill: am4core.color('#fc03a5'),
          // stroke: am4core.color('#fc03a5'),
        };
      });
    },
    mapData: function (data) {
      return data.map((item, index) => {
        return {
          ...item,
          outerScale: 16,
          innerScale: 8,
          //color: am4core.color('#fc1c03'),
          color: this.colorSet.next(),
          // fill: am4core.color('#fc1c03'),
          // stroke: am4core.color('#fc1c03'),
        };
      });
    },
    getScales: function (index) {
      if (index === 0) return { outerScale: 48, innerScale: 24 };
      if (index === 1) return { outerScale: 32, innerScale: 16 };
      return { outerScale: 16, innerScale: 8 };
    },
    createCircles: function () {
      this.imageSeries.mapImages.template.children.clear();
      this.createOuterCircle();
      this.createInnerCircle();
    },
    createOuterCircle: function () {
      const outerCircle = this.imageSeries.mapImages.template.createChild(am4core.Circle);
      outerCircle.propertyFields.radius = 'outerScale';
      outerCircle.fill = am4core.color('#A166F1');
      outerCircle.propertyFields.fill = '#A166F1';
      outerCircle.fillOpacity = 0.28;
      outerCircle.strokeWidth = 1;
      outerCircle.verticalCenter = 'middle';
      outerCircle.horizontalCenter = 'middle';
      outerCircle.nonScaling = true;
    },
    filtering: function () {
      if (this.currentTab === 'interruptionFrequency') {
        this.isOpenFilter = true;
        this.isOpenFilter2 = false;
        return false;
      } else {
        this.isOpenFilter = false;
        this.isOpenFilter2 = true;
      }
    },
    createInnerCircle: function () {
      const innerCircle = this.imageSeries.mapImages.template.createChild(am4core.Circle);
      innerCircle.propertyFields.radius = 'innerScale';
      innerCircle.fill = am4core.color('#A166F1');
      innerCircle.propertyFields.fill = '#A166F1';
      //innerCircle.propertyFields.stroke = "color";
      innerCircle.fillOpacity = 0.6;
      innerCircle.strokeWidth = 1;
      innerCircle.verticalCenter = 'middle';
      innerCircle.horizontalCenter = 'middle';
      innerCircle.nonScaling = true;

      // 원 안에 숫자를 표시하기 위한 레이블 추가
      const label = this.imageSeries.mapImages.template.createChild(am4core.Label);
      label.text = '{score}'; // 데이터에 연결된 값 표시
      ///label.text = "333";  // 데이터에 연결된 값 표시
      label.fill = am4core.color('#ffffff'); // 텍스트 색상 (검정)
      label.fontSize = 12; // 텍스트 크기
      label.horizontalCenter = 'middle'; // 가로 중앙 정렬
      label.verticalCenter = 'middle'; // 세로 중앙 정렬
      //label.fontWeight = "bold";
      label.nonScaling = true; // 확대/축소에 따라 크기 변화하지 않음

      innerCircle.events.on('inited', (event) => this.animateOuterBullet(event.target));
    },
    animateOuterBullet: function (circle) {
      // Animate the inner circle to grow and then shrink
      let animation = circle.animate(
        [
          { property: 'radius', from: 24, to: circle.radius }, // Adjust the to value as needed
          { property: 'fillOpacity', from: 1, to: 0.7 },
        ],
        2000,
        am4core.ease.circleOut
      );

      animation.events.on(
        'animationended',
        function (event) {
          // Reverse the animation to shrink the inner circle
          let reverseAnimation = circle.animate(
            [
              { property: 'radius', from: circle.radius + 4, to: circle.radius }, // Reverse the radius
              { property: 'fillOpacity', from: 0.3, to: 0.7 },
            ],
            2000,
            am4core.ease.circleIn
          );
          reverseAnimation.events.on(
            'animationended',
            function () {
              // Restart the inner circle animation
              this.animateOuterBullet(circle);
            }.bind(this)
          );
        }.bind(this)
      );
    },
    goHome(zoom) {
      this.geoChart.goHome();
      this.chartZoom();
      //chart.zoomToGeoPoint({ latitude: regionSereies.latitude, longitude: regionSereies.longitude }, zoom);
    },
    chartZoom() {
      var chart = this.geoChart;
      //chart.zoomToGeoPoint({ latitude: regionSereies.latitude, longitude: regionSereies.longitude }, zoom);

      setTimeout(function () {
        // 확대할 위치 설정 (예: 서울, 한국)
        var target = {
          latitude: 37.5665, // 위도 (서울)
          longitude: 126.978, // 경도 (서울)
        };

        // 확대 실행: 특정 위치로 이동하고 줌 레벨을 설정 (예: 줌 레벨 5)
        chart.zoomToGeoPoint(target, 2, true); // true는 애니메이션 효과
      }, 1000); // 2초 지연 (2000ms)
    },
    beforeDestroy() {
      if (this.geoChart) {
        this.geoChart.dispose();
      }

      document.removeEventListener('click', this.handleDocumentClick);
    },
    usageMockData() {
      return {
        usageStatus: [
          {
            longitude: 8.684307,
            latitude: 50.112258,
            region: 'EU (Frankfurt)',
            spotCountTotal: 3,
            spotTotalPercent: 5.5556,
            onDemandCountTotal: 51,
            onDemandTotalPercent: 94.4444,
            instanceCountTotal: 54,
            availabilityZones: ['eu-central-1a', 'eu-central-1b'],
            instanceTypes: ['g5.xlarge', 'g4.3xlarge', 'p2.xlarge'],
          },
          {
            longitude: 139.6823,
            latitude: 35.6785,
            region: 'Asia Pacific (Tokyo)',
            spotCountTotal: 17,
            spotTotalPercent: 39.5349,
            onDemandCountTotal: 26,
            onDemandTotalPercent: 60.4651,
            instanceCountTotal: 43,
            availabilityZones: ['ap-northeast-1a', 'ap-northeast-1c'],
            instanceTypes: [
              'g5.xlarge',
              'g4.large',
              'g4.3xlarge',
              'g4dn.xlarge',
              'p2.2xlarge',
              'p2.2xlarge',
              'p3.8xlarge',
              'f1.2xlarge',
            ],
          },
          {
            longitude: -120.169814,
            latitude: 37.464688,
            region: 'US West (N. California)',
            spotCountTotal: 1,
            spotTotalPercent: 100.0,
            onDemandCountTotal: 0,
            onDemandTotalPercent: 0.0,
            instanceCountTotal: 1,
            availabilityZones: ['us-west-1a'],
            instanceTypes: ['g3.4xlarge'],
          },
          {
            longitude: -120.848013,
            latitude: 44.420928,
            region: 'US West (Oregon)',
            spotCountTotal: 4,
            spotTotalPercent: 100.0,
            onDemandCountTotal: 0,
            onDemandTotalPercent: 0.0,
            instanceCountTotal: 4,
            availabilityZones: ['us-west-2a', 'us-west-2b'],
            instanceTypes: ['g4dn.xlarge'],
          },
        ],
        batchScore: [
          {
            region: 'US East (Ohio)',
            regionName: 'us-east-2',
            availabilityZone: 'us-east-2a',
            ranking: 1,
            score: 9,
            longitude: -83.337088,
            latitude: 40.273751,
          },
          {
            region: 'Asia Pacific (Singapore)',
            regionName: 'ap-southeast-1',
            availabilityZone: 'ap-southeast-1a',
            ranking: 2,
            score: 8,
            longitude: 103.867587,
            latitude: 1.345573,
          },
          {
            region: 'Canada (Central)',
            regionName: 'ca-central-1',
            availabilityZone: 'ca-central-1a',
            ranking: 2,
            score: 8,
            longitude: -123.136246,
            latitude: 49.28755,
          },
          {
            region: 'Asia Pacific (Singapore)',
            regionName: 'ap-southeast-1',
            availabilityZone: 'ap-southeast-1a',
            ranking: 3,
            score: 4,
            longitude: 103.867587,
            latitude: 1.345573,
          },
          {
            region: 'Asia Pacific (Sydney)',
            regionName: 'ap-southeast-2',
            availabilityZone: 'ap-southeast-2a',
            ranking: 1,
            score: 9,
            longitude: 151.22705,
            latitude: -33.867139,
          },
          {
            region: 'Asia Pacific (Seoul)',
            regionName: 'ap-northeast-2',
            availabilityZone: 'ap-northeast-2a',
            ranking: 4,
            score: 3,
            longitude: 127.006875,
            latitude: 37.579378,
          },
          {
            region: 'Asia Pacific (Tokyo)',
            regionName: 'ap-northeast-1',
            availabilityZone: 'ap-northeast-1a',
            ranking: 4,
            score: 3,
            longitude: 139.6823,
            latitude: 35.6785,
          },
          {
            region: 'US East (N. Virginia)',
            regionName: 'us-east-1',
            availabilityZone: 'us-east-1a',
            ranking: 5,
            score: 2,
            longitude: -79,
            latitude: 37.3,
          },
          {
            region: 'US West (Oregon)',
            regionName: 'us-west-2',
            availabilityZone: 'us-west-2a',
            ranking: 5,
            score: 2,
            longitude: -120.848013,
            latitude: 44.420928,
          },
        ],
        batchScore2: [
          {
            region: 'US East (Ohio)',
            regionName: 'us-east-2',
            availabilityZone: 'us-east-2a',
            ranking: 1,
            score: 8,
            longitude: -83.337088,
            latitude: 40.273751,
          },
          {
            region: 'Asia Pacific (Singapore)',
            regionName: 'ap-southeast-1',
            availabilityZone: 'ap-southeast-1a',
            ranking: 2,
            score: 1,
            longitude: 103.867587,
            latitude: 1.345573,
          },
          {
            region: 'Canada (Central)',
            regionName: 'ca-central-1',
            availabilityZone: 'ca-central-1a',
            ranking: 4,
            score: 5,
            longitude: -123.136246,
            latitude: 49.28755,
          },
          {
            region: 'Asia Pacific (Tokyo)',
            regionName: 'ap-northeast-1',
            availabilityZone: 'ap-northeast-1a',
            ranking: 3,
            score: 6,
            longitude: 139.6823,
            latitude: 35.6785,
          },
          {
            region: 'Europe (Frankfurt)',
            regionName: 'eu-central-1',
            availabilityZone: 'eu-central-1a',
            ranking: 2,
            score: 3,
            longitude: 50.112258,
            latitude: 8.684307,
          },
          {
            region: 'US West (Oregon)',
            regionName: 'us-west-2',
            availabilityZone: 'us-west-2a',
            ranking: 1,
            score: 9,
            longitude: -120.848013,
            latitude: 44.420928,
          },
          {
            region: 'US East (N. Virginia)',
            regionName: 'us-east-1',
            availabilityZone: 'us-east-1a',
            ranking: 5,
            score: 7,
            longitude: -79,
            latitude: 37.3,
          },
          {
            region: 'South America (São Paulo)',
            regionName: 'sa-east-1',
            availabilityZone: 'sa-east-1a',
            ranking: 3,
            score: 5,
            longitude: -46.66492,
            latitude: -23.534488,
          },
          {
            region: 'Asia Pacific (Seoul)',
            regionName: 'ap-northeast-2',
            availabilityZone: 'ap-northeast-2a',
            ranking: 5,
            score: 10,
            longitude: 127.006875,
            latitude: 37.579378,
          },
          {
            region: 'Middle East (Bahrain)',
            regionName: 'me-south-1',
            availabilityZone: 'me-south-1a',
            ranking: 4,
            score: 7,
            longitude: 50.544137,
            latitude: 26.052659,
          },
        ],
      };
    },
    formatDate(date) {
      return moment(date).format('YYYY.MM.DD');
    },
    tablebn(e) {
      if (e.target.classList.contains('on') === false) {
        document.querySelector('.spot-gpu-panel-container').style.display = 'none';
        e.target.classList.add('on');
      } else {
        document.querySelector('.spot-gpu-panel-container').style.display = 'block';
        e.target.classList.remove('on');
      }
    },
  },
};
</script>

<style lang="scss">
.geo-map {
  height: 650px;
  /* background-color: #1e2224; */
  border-radius: 0 8px 8px 8px;

  div {
    border-radius: inherit;
  }
}

.gpu-tab {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 20%;
  height: 44px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #f5f5f5;
  color: #888888;
  border: 1px solid #e3ebf1;
  border-bottom: 1px solid;
  border-bottom-color: #00a5ed;
  cursor: pointer;
}

.gpu-tab.active {
  border: 1px solid;
  background-color: #ffffff;
  border-color: #00a5ed;
  border-bottom: 0;
  color: #00a5ed;
  font-weight: 700;
}

.box-wrap .flex.items-center:last-child {
  padding-bottom: 0;
}

.spot-usage-detail-tooltip {
  z-index: 100;
  position: absolute;
  padding: 1.25rem 1.75rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(26, 227, 187, 0.2);
  background: rgba(37, 43, 45, 0.85);
  box-shadow: 0px 2px 4px 0px rgba(26, 227, 187, 0.04), 0px 2px 20px 0px rgba(26, 227, 187, 0.12);
  backdrop-filter: blur(10px);

  .popup-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    padding: 8px 0;
    border-bottom: 1px solid #555555;
    width: 100%;

    label {
      color: #bbbbbb;
      font-size: 14px;
      font-weight: 400;
      padding-right: 5px;
    }

    p {
      color: #fff;
      font-size: 14px;
      font-weight: 700;
    }

    span {
      font-weight: 400;
    }
  }
}

.spot-usage-detail-tooltip .tooltip-title-conttainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  font-family: 'Noto Sans KR';
  font-style: normal;
  line-height: 150%; /* 1.125rem */
}

.spot-usage-detail-tooltip .tooltip-title-conttainer .title {
  color: #fff;

  /* H4 */
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.03125rem;
}

.spot-usage-detail-tooltip .tooltip-title-conttainer .standardDate {
  color: #999;

  /* Caption */
  font-size: 0.75rem;
  font-weight: 400;
}

.region-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 20px 0;

  .name {
    color: #bbb;

    /* H5 */
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 700;
  }

  .detailBtn {
    display: flex;
    padding: 0.125rem 0.125rem 0.125rem 0.5rem;
    justify-content: center;
    align-items: center;

    color: #bbb;

    /* Caption */
    font-size: 0.75rem;
    font-weight: 400;

    border-radius: 0.25rem;
    border: 1px solid #888;
  }
}

.tooltip-detail-info-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-width: 12.5rem;
  align-items: flex-start;
  gap: 0.5rem;
  align-self: stretch;
  font-style: normal;
  line-height: 150%; /* 1.3125rem */

  .title {
    color: #bbb;

    /* Body2 */
    font-size: 0.875rem;
    font-weight: 400;
  }

  .value {
    color: #fff;

    /* H5 */
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: -0.03125rem;
  }
}

.tooltip-spot {
  padding: 20px 28px;

  & h4 {
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .tooltip_content {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 8px 0;
    border-bottom: 1px solid #555555;

    label {
      color: #bbbbbb;
      font-size: 14px;
      font-weight: 400;
      padding-right: 5px;
    }

    p {
      color: #fff;
      font-size: 14px;
      font-weight: 700;
    }
  }

  .provided_spot_family {
    font-size: 14px;
    color: #bbb;
    padding: 8px 0;
  }

  .base_date {
    font-size: 14px;
    color: #bbb;
    margin-top: 16px;
  }
}

.popup-instance-type-select {
  color: #bbb;
  font-size: 12px;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;

  img {
    transform: rotate(180deg);
  }
}

.instance-type {
  max-height: 200px;
  overflow: auto;
  z-index: 100;
  position: absolute;
  right: 0;
  padding: 1.25rem 1.75rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(26, 227, 187, 0.2);
  background: rgba(37, 43, 45, 0.85);

  /* GPU Shadow */
  box-shadow: 0px 2px 4px 0px rgba(26, 227, 187, 0.04), 0px 2px 20px 0px rgba(26, 227, 187, 0.12);
  backdrop-filter: blur(10px);

  display: flex;
  flex-direction: column;
  gap: 8px;

  p {
    font-weight: 700;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
  }
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
}

.tag {
  display: flex;
  padding: 3px 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 100px;
  font-weight: 500;
  color: white;
  text-align: center;
  font-size: 11px;
  border: 1px solid transparent;
  width: max-content;
  background-color: #ffffff;
  color: #00a5ed;
  border-color: #00a5ed;
}

.tooltip_area {
  display: flex;
  align-items: center;
  gap: 20px;

  padding-top: 12px;
  padding-bottom: 2px;

  &_title {
    h4 {
      font-size: 14px;
      font-weight: 700;
      text-align: center;
    }
  }

  .tooltip_info {
    border-bottom: none;

    p {
      font-size: 14px;
      text-align: center;

      font-weight: 400;
      padding-bottom: 2px;
    }
  }
}

.spot-gpu-panel-container {
  display: flex;
  flex-direction: column;
  gap: 9px;
  position: absolute;
  right: 2.94rem;
  top: 7.3125rem;
  color: #fff;

  .title-panel {
    font-weight: 700;
    font-size: 14px;
  }

  .spot-gpu-panel {
    border-spacing: 0;
    border-collapse: separate;
    border-radius: 0.5rem;
    border: 1px solid rgba(26, 227, 187, 0.2);
    box-shadow: 0px 2px 4px 0px rgba(26, 227, 187, 0.04), 0px 2px 20px 0px rgba(26, 227, 187, 0.12);
    backdrop-filter: blur(10px);
    background: rgba(37, 43, 45, 0.85);

    .header-panel {
      color: #00a5ed;
      font-size: 12px;
      font-weight: 700;

      .spot-gpu-header {
        padding: 13.5px 0;
        border-bottom: 1px solid rgba(26, 227, 187, 0.2);
      }
    }

    .body-panel {
      font-size: 12px;
      font-weight: 400;
      color: #ffffff;

      .spot-gpu-cell {
        padding: 13.5px 20px;
        border-bottom: none;
        color: white;
      }
    }
  }
}
</style>
<style src="@/assets/jh_custom_add.css"></style>
