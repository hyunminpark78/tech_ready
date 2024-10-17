<template>
  <li class="mt-0.5 border border-gray-300 px-3 py-2">
    <component
      :is="wrapper"
      class="flex justify-between"
      :class="hasLink ? 'cursor-pointer' : undefined"
      :href="hasLink ? (available ? ssoLink : link) : undefined"
      :target="hasLink ? '_blank' : undefined"
    >
      <div>
        <p class="text-sm font-bold">{{ serviceName }}</p>
        <p class="text-gray-500 text-xs-">{{ `접속 ${available ? '가능' : '불가'}` }}</p>
      </div>
      <img :src="imgSrc" :alt="imgAlt" />
    </component>
  </li>
</template>

<script>
import constants from '@/constants/constants';

export default {
  props: {
    serviceName: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    wrapper() {
      return this.hasLink ? 'a' : 'div';
    },
    link() {
      return constants.URLS[Object.keys(constants.URLS).find((s) => s === this.serviceName.pascalToConstant())];
    },
    ssoLink() {
      return constants.URLS[
        Object.keys(constants.URLS).find((s) => s === `${this.serviceName.pascalToConstant()}_SSO`)
      ];
    },
    hasLink() {
      return !!this.link;
    },
    imgSrc() {
      return require(`@/assets/images/ico-rcheck-${this.available ? 'on' : 'off'}.svg`);
    },
    imgAlt() {
      return this.available ? 'on' : 'off';
    },
  },
};
</script>
