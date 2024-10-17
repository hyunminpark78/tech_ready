<template>
  <Section v-if="hasAiPattern || hasAiAnormal">
    <SectionHeader
      title-class="flex items-center mb-5 text-xl"
      :icon="{
        src: require('@/assets/images/ico-dataanalysis.svg'),
        alt: '맞춤분석 및 예측',
      }"
      title="맞춤분석 및 예측"
    />

    <SectionMain>
      <div
        :class="hasAiAnormal && hasAiPattern ? 'flex justify-between mb-8 card-wrap-2' : 'flex justify-between mb-8'"
      >
        <!-- Card (Flip) -->
        <FlipContainer :face="face">
          <template #front>
            <!-- Front Card - 이상 비용 탐지 -->
            <CardFraudDetection :senseVal="senseSetVal" @sensitivity-change="toggleFace" />
          </template>
          <template #back>
            <!-- Back Card - 민감도 설정 -->
            <CardFraudDetectionSensitivity
              v-if="backFace === 'sensitivity'"
              :senseSetVal="senseSetVal"
              @card-change="toggleFace"
              @sensitivity-value="selectSensitive"
            />
            <!-- Back Card - 알림 구간 설정 -->
            <CardFraudDetectionUserArmIntvl
              v-else-if="backFace === 'userArmIntvl'"
              :userArmIntvl="userArmIntvl"
              @card-change="toggleFace"
              @user-arm-intvl-set="userArmIntvlSet"
            />
          </template>
        </FlipContainer>

        <!-- Card : 비용 패턴 분석 (변화 Top 5) -->
        <CardPatternAnalysis />
      </div>
    </SectionMain>
  </Section>
</template>

<script>
import Section, { SectionHeader, SectionMain } from '@/components/Section';
import FlipContainer from '@/components/FlipContainer.vue';
import { CardFraudDetection, CardFraudDetectionSensitivity, CardPatternAnalysis, CardFraudDetectionUserArmIntvl } from '@/pages/Dashboard/cards';

export default {
  components: {
    CardFraudDetection,
    CardFraudDetectionSensitivity,
    CardPatternAnalysis,
    FlipContainer,
    Section,
    SectionHeader,
    SectionMain,
    CardFraudDetectionUserArmIntvl,
  },
  props: {
    senseSetVal: {
      type: String,
      default: 'M',
    },
    userArmIntvl: {
      type: Object,
      default: () => {
        return {
          intvlStrAmt: 0,
          intvlEndAmt: 0,
        };
      },
    },
    hasAiPattern: {
      type: Boolean,
      default: false,
    },
    hasAiAnormal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      face: 'front',
      backFace: 'sensitivity',
    };
  },
  methods: {
    toggleFace(backFace) {
      this.face = this.face === 'front' ? 'back' : 'front';
      this.backFace = backFace;
    },
    selectSensitive(userSensitive) {
      this.$emit('change-user-sensitive', userSensitive);
    },
    userArmIntvlSet(userArmIntvl) {
      this.$emit('change-user-arm-intvl', userArmIntvl);
    },
  },
};
</script>
