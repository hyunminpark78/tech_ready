<template>
  <div>
    <div class="absolute left-0 right-0 z-10 sub-nav-wrap" :class="{ hidden: !subNavVisible }"></div>
    <div class="container">
      <nav class="relative flex nav">
        <!-- 하위 navigation O -->
        <template v-for="item in items">
          <div
            v-if="item.children && item.children.length > 0"
            :key="item.name"
            class="relative flex items-center px-1.5 py-6 mx-4 font-bold border-b-3 border-transparent"
            :class="{ 'is-current': $route.path.startsWith(item.path) }"
            @mouseover="subNavVisible = true"
            @mouseleave="subNavVisible = false"
          >
            <span class="px-0.5 cursor-pointer">{{ item.name }}</span>
            <img
              :src="require(`@/assets/images/arrow-typ-01${$route.path.startsWith(item.path) ? '' : '-black'}.svg`)"
              alt="."
              class="ml-2.5"
            />

            <div
              class="absolute left-0 z-10 flex items-center p-4 text-base sub-nav"
              style="font-size: 14px; font-weight: normal; font-color: gray"
            >
              <template v-for="(child, index) in item.children">
                <div
                  :key="index"
                  v-if="child.directPopup"
                  :class="{ on: $route.path.startsWith(`${item.path}/${child.path}`) }"
                  class="mr-7 cursor-pointer"
                  @click="getPopup()"
                >
                  {{ child.name }}
                </div>
                <RouterLink
                  v-else
                  :key="`${item.path}/${child.path}`"
                  :to="`${item.path}/${child.path}`"
                  class="mr-7"
                  :class="{ on: $route.path.startsWith(`${item.path}/${child.path}`) }"
                  style="min-width: fit-content"
                >
                  {{ child.name }}
                </RouterLink>
              </template>
            </div>
          </div>

          <!-- 하위 navigation X -->
          <RouterLink
            v-else
            :key="item.path"
            class="relative px-4 py-6 mx-4 font-bold border-transparent border-b-3"
            :class="{ 'is-current': $route.path.startsWith(item.path) }"
            :to="item.path"
          >
            <span class="px-0.5 cursor-pointer">{{ item.name }}</span>
          </RouterLink>
        </template>
      </nav>
    </div>
    <Popup :visible="popup.visible" :content="popup.content" @closePopup="closePopup" />
  </div>
</template>

<script>
import dashboardService from '@/services/dashboardService';
import Popup from '@/components/Popup';
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    Popup,
  },
  data() {
    return {
      subNavVisible: false,
      reportYn: false,
      popup: {
        visible: false,
        content: '',
      },
    };
  },
  methods: {
    getPopup() {
      this.popup.content = `${this.$t('support.hello')}\n${this.$t('support.inquiryFunctionPrepared')}\n${this.$t(
        'support.anyQuestionsEmail'
      )} ${this.$t('support.thankYou')}`;
      this.popup.visible = true;
    },
    closePopup() {
      this.popup.visible = false;
    },
  },
  created() {},
};
</script>
