<template>
  <section v-if="visible" style="position: absolute !important" :style="{ left: `${screenX}px`, top: `${screenY}px` }">
    <div class="tooltip-layer" style="display: block">
      <div style="font-weight: 700" class="ti">{{ tooltipContent.headerTitle }}</div>
      <div class="ls">
        <span class="primary"> {{ tooltipContent.code }}</span> :
        {{ tooltipContent.codeContent }}
      </div>
      <div class="ls">
        <span class="primary"> {{ tooltipContent.des }}</span> :
        {{ tooltipContent.desContent }}
      </div>
      <button class="close jsTooltipClose1" @click="$emit('close')">툴팁 닫기</button>
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
    tooltipContent: {
      type: Object,
      default: () => ({
        headerTitle: '',
        code: '',
        des: '',
        codeContent: '',
        desContent: '',
      }),
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
