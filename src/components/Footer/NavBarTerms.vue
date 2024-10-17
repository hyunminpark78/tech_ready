<template>
  <div>
    <div class="py-8 -mr-4">
      <a class="px-2 mx-2 font-bold text-gray-700 text-xs-" @click="openModals('T')">{{
        $t('common.button.legalNotice')
      }}</a>
      <a class="px-2 mx-2 font-bold text-gray-700 text-xs-" @click="openModals('P')">{{
        $t('common.button.privacyStatement')
      }}</a>
      <a href="#" class="px-2 mx-2 text-gray-700 text-xs-">COPYRIGHT © SK TELECOM CO., LTD. ALL RIGHTS RESERVED.</a>
    </div>
    <template v-if="openCont === 'P'">
      <Privacy @close="openCont = ''" />
    </template>
    <template v-else-if="openCont === 'T'">
      <Terms @close="openCont = ''" />
    </template>
  </div>
</template>

<script>
import Privacy from './Privacy/Privacy.vue';
import Terms from './Terms/Terms.vue';

export default {
  components: { Privacy, Terms },
  data() {
    return {
      openCont: '',
    };
  },
  methods: {
    openModals(param) {
      console.log('param', param);
      this.openCont = param;
    },
  },
};
</script>
