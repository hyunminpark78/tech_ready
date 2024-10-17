import Vue from 'vue';
import { numberCutDecimal } from '../CmmtPsblTgt/CostOptiCommon';

export default Vue.extend({
  data: function () {
    return {
      mnthSaveCost: 0,
    };
  },
  beforeMount() {
    this.numberCutDecimal(this.params.getValue());
  },

  methods: {
    buttonClicked(e) {
      console.log(this.loading);
      console.log(this.params);
    },
    numberCutDecimal() {
      const paramValue = this.params.getValue();
      this.mnthSaveCost = numberCutDecimal(paramValue.mnthSaveCost);
      // this.mnthSaveCost = numberCutDecimal(paramValue.mnthSaveCost);
      // this.mnthSaveCost = numberCutDecimal(paramValue.mnthSaveCost);
    },
  },
  template: `
  
  <div class="cell-in-text" @click="(e)=>buttonClicked(e)">
  <button class="w-5 mr-3" >
    <img src=${require(`@/assets/images/ico-rcheck-off.svg`)} alt="."/>
  </button>
    <div class="tr">
      <div class="td text-left">
      <span>월 예상 절감액</span>
      <span style="float:right">₩{{mnthSaveCost}</span>
      </div>
      <div class="td text-left">
      <span>선결제 비용</span>
      <span style="float:right">₩{{mnthSaveCost}}</span>
      </div>
      <div class="td text-left">
      <span>월 비용</span>
      <span style="float:right">₩{{mnthSaveCost}}</span>
      </div>
    </div>
<div>
  `,
});
