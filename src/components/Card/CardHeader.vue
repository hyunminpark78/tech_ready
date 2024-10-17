<template>
  <div class="flex" :class="wrapperClass || [{ 'justify-between': !titleIconSrc, 'items-center': type1 }]">
    <!-- type 1 -->
    <template v-if="type1">
      <h3 class="font-bold" :class="{ 'mb-1': !titleIconSrc, 'mr-3': titleIconSrc }">
        {{ title }}
      </h3>
      <!-- conditional: title-icon-src -->
      <button v-if="titleIconSrc">
        <img :src="titleIconSrc" alt="." />
      </button>
      <!-- // conditional: title-icon-src -->

      <!-- functions -->
      <div v-if="$slots.functions" class="flex items-center">
        <slot name="functions" />
      </div>

      <!-- conditional: updatedAt -->
      <p v-if="!!updatedAt" class="text-xs text-gray-500">최근 업데이트 : {{ updatedAt | date }}(UTC)</p>
      <!-- // conditional: updatedAt -->
    </template>

    <!-- type 2 -->
    <template v-else-if="type2">
      <div>
        <h3 class="font-bold" :class="{ 'mb-1': !titleIconSrc, 'mr-3': titleIconSrc }">
          {{ title }}
        </h3>
        <slot name="message" />
      </div>
      <div>
        <p v-if="!!updatedAt" class="text-xs text-right text-gray-500">최근 업데이트 : {{ updatedAt | date }}(UTC)</p>
        <slot name="custom" />
      </div>
    </template>
    <template v-else-if="type3">
      <div>
        <h3 class="font-bold" :class="{ 'mb-1': !titleIconSrc, 'mr-3': titleIconSrc }">
          {{ title }}
        </h3>
        <slot name="message" />
      </div>
      <div>
        <a class="flex items-center ml-6 text-sm text-gray-500">
          <span class="mr-2">
            <template v-if="isMec === 'Y'">
              <a :href="urls.MBMP_SSO" target="_blank"> 상세보기 </a>
            </template>
            <template v-else>
              <RouterLink to="/cost/history"> 상세보기 </RouterLink>
            </template>
          </span>
          <img src="@/assets/images/ico-link.svg" alt="." />
        </a>
      </div>
    </template>

    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script>
import moment from 'moment';
import constants from '@/constants/constants';

export default {
  props: {
    type1: Boolean,
    type2: Boolean,
    type3: Boolean,
    wrapperClass: {
      type: [Object, Array, String],
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    isMec: {
      type: String,
      defualt: 'N',
    },
    titleIconSrc: {
      type: String,
      default: null,
    },
    updatedAt: {
      type: [String, Object],
      default: null,
      // validator: (value) => moment(value).isValid(),
    },
  },
  computed: {
    urls() {
      return constants.URLS;
    },
  },
};
</script>
