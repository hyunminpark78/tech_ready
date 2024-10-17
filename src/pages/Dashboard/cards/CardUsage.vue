<template>
  <Card>
    <template v-if="hasData">
      <CardHeader type1 title="주요자원 사용 현황" :updated-at="usageDate | date" />
      <CardMessage> Server, Database 자원 사용 추이</CardMessage>
      <div>
        <div class="flex justify-center mb-2">
          <OcpButton
            small
            class="px-2.5 py-1 mr-3 h-8"
            :number="400"
            text="Server"
            :active="activeUsageDataType === 'VM'"
            @click="updateUsageDataType('VM')"
          />
          <OcpButton
            small
            class="px-2.5 py-1 mr-3 h-8"
            :number="400"
            text="Database"
            :active="activeUsageDataType === 'DB'"
            @click="updateUsageDataType('DB')"
          />
        </div>
      </div>
      <CardMain>
        <div>
          <g-area-chart
            chartHeight="280"
            chartTheme="dash_usageState"
            :data="selectServerUsage"
            :propsInfo="propsInfo"
          />
        </div>
      </CardMain>
    </template>

    <!-- No Data -->
    <template v-else>
      <div class="flex items-center justify-between">
        <h3 class="mb-1 font-bold">주요자원 사용 현황</h3>
        <!-- <p class="text-xs text-gray-500">최근 업데이트 : {{ resourceDate }}</p> -->
      </div>
      <div class="flex flex-col items-center justify-center" style="height: 293px">
        <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
        <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
      </div>
    </template>
    <!-- // No Data -->
  </Card>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Card, { CardHeader, CardMain, CardMessage } from '@/components/Card';
import OcpButton from '@/components/shared/OcpButton.vue';
import moment from 'moment';
import * as _ from 'lodash';
export default {
  components: {
    Card,
    CardHeader,
    CardMain,
    CardMessage,
    OcpButton,
  },
  data() {
    return {
      propsInfo: {
        dateProp: 'stdDt',
        insProp: ['instsCnt', 'krwUseAmt', 'ondmCnt'],
        isFormat: true,
      },
    };
  },
  computed: {
    ...mapState('dashboard', ['activeUsageDataType', 'serverUsage']),
    hasData() {
      return this.serverUsage.length > 0 ? true : false; // FIXME
    },
    usageDate() {
      return this.serverUsage.length > 0 ? this.serverUsage[0].dataDtm : '';
    },
    selectServerUsage() {
      return _.filter(this.serverUsage, (data) => data.svrSepNm === this.activeUsageDataType);
    },
  },
  methods: {
    ...mapActions('dashboard', ['updateUsageDataType']),
  },
};
</script>
