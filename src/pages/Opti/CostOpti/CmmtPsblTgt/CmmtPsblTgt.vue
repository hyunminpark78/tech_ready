<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.mainOptimization')"
        title2="구매비용최적화"
        :title3="$t('menu.availabilityService')"
        :sub-title="isAutospContractSelected ? $t('optimization.autospExcludedDesc') : ''"
      />
      <Section>
        <SectionMain>
          <CmmtPsblTgtFilter />
          <CmmtPsblTgtCtrtChart />
          <CmmtPsblTgtOndemandChart />
          <CmmtPsblTgtCmmitmentableGrid />
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import CmmtPsblTgtFilter from './CmmtPsblTgtFilter';
import CmmtPsblTgtCtrtChart from './CmmtPsblTgtCtrtChart';
import CmmtPsblTgtOndemandChart from './CmmtPsblTgtOndemandChart';
import CmmtPsblTgtCmmitmentableGrid from './CmmtPsblTgtCmmitmentableGrid';

export default {
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    CmmtPsblTgtFilter,
    CmmtPsblTgtCtrtChart,
    CmmtPsblTgtOndemandChart,
    CmmtPsblTgtCmmitmentableGrid,
  },
  computed: {
    ...mapGetters('common', ['getAwsCtrts', 'getAzureCtrts', 'getGcpCtrts']),
    ...mapGetters('costOpti', ['isAutospContractSelected']),
  },
  async created() {
    this.initCsp();
  },
  methods: {
    ...mapActions('costOpti', ['fetchParam']),
    initCsp() {
      let cspTypCd;
      if (this.getAwsCtrts.length > 0) {
        cspTypCd = 'AWS';
      } else if (this.getAzureCtrts.length > 0) {
        cspTypCd = 'AZURE';
      } else if (this.getGcpCtrts.length > 0) {
        cspTypCd = 'GCP';
      }
      this.fetchParam({ state: { cspTypCd } });
    },
  },
};
</script>
