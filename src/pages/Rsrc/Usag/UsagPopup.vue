<template>
  <section
    v-if="visible"
    class="z-30 p-8 rounded policy-content w-600"
    style="overflow: auto; border: 1px solid #00a5ed; height: 400px; position: absolute !important"
    :style="{ left: `${screenX}px`, top: `${screenY}px` }"
  >
    <h2 class="mb-4 text-2xl text-primary-600">TAGS</h2>

    <button class="absolute top-0 right-0 close-policy-modal mt-7 mr-7">
      <img src="@/assets/images/ico-btn-search-close.svg" alt="." @click="$emit('close')" />
    </button>

    <div class="mb-3 flex items-center">
      <div
        class="tit4-wrap"
        style="
          font-size: 16px !important;
          color: #5ba9ca !important;
          --text-opacity: 1;
          color: rgba(91, 169, 202, var(--text-opacity));
        "
      >
        ID
      </div>
      <p
        class="text-sm text-gray-700 font-medium"
        style="padding: 0 20px 10px; font-weight: 700; word-break: break-all"
      >
        {{ detailData.id }}
      </p>
    </div>

    <div>
      <table
        class="w-full bg-white border-t border-primary-200 board-table"
        style="border-top: 1px solid #00a5ed; border-bottom: 1px solid #e3ebf1"
      >
        <template v-for="item in detailData.tags">
          <tr class="border-b border-primary-200 bg-primary-300">
            <th class="font-bold text-xs- text-primary-600 px-4 py-4 text-left">{{ item.tagKey }}</th>
            <td class="px-8 py-4 text-left text-sm" style="background-color: #ffff">{{ item.tagVal }}</td>
          </tr>
        </template>
      </table>
      <template v-if="!detailData.tags || !detailData.tags.length">
        <div class="flex flex-col items-center justify-center" style="margin-top: 10%; height: 100px">
          <img src="@/assets/images/ico-nodata-chart.svg" alt="." style="width: 30%; height: 30%" />
          <p class="mt-3 text-gray-700" style="font-size: 15px">{{ $t('common.paragraph.noDataDisplay') }}</p>
        </div>
      </template>
    </div>
  </section>
  <!-- 알림 -->
</template>

<script>
import moment from 'moment';
import _ from 'lodash';
import { mapState } from 'vuex';
export default {
  props: {
    visible: {
      type: Boolean,
    },
    detailData: {
      type: Object,
      default: () => {},
    },
    screenX: {
      type: Number,
    },
    screenY: {
      type: Number,
    },
  },
};
</script>
