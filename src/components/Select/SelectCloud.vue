<template>
  <div class="select_wrap mr-3" style="width: 200px; height: auto">
    <button class="sel jsBtnShow1" style="height: 100%">
      <span class="down flex show-arrow mx-3" style="display: flex">
        <span class="mr-3">Cloud</span>
        <span class="contents-line"></span>
        <span v-if="cspTypCd === 'AWS'" class="mt-5 ml-6">
          <img src="@/assets/images/logo_typ_aws.svg" alt="aws" />
        </span>
        <span v-else-if="cspTypCd === 'AZURE'" class="mt-5 ml-4">
          <img src="@/assets/images/logo_typ_azure.svg" alt="azure" />
        </span>
        <span v-else-if="cspTypCd === 'GCP'" class="mt-6 ml-4">
          <img src="@/assets/images/logo_typ_gcp.svg" alt="gcp" />
        </span>
      </span>
    </button>
    <div class="cloud_select_layer">
      <!-- radio -->
      <label class="radio">
        <input
          type="radio"
          name="cspTypCd"
          value="AWS"
          :checked="cspTypCd === 'AWS'"
          :disabled="awsCtrtsCount > 0 ? false : true"
          @click="awsCtrtsCount > 0 ? true : false"
        />
        <span class="label">
          <span class="i"><img src="../../assets/images/logo_aws.svg" alt="aws" /></span>
          <span class="t">
            <strong>AWS</strong>
            <span>{{ awsCtrtsCount }} Accounts</span>
          </span>
        </span>
      </label>
      <!-- //radio -->
      <!-- radio -->
      <label class="radio">
        <input
          type="radio"
          name="cspTypCd"
          value="AZURE"
          :checked="cspTypCd === 'AZURE'"
          :disabled="azureCtrtsCount > 0 ? false : true"
          @click="azureCtrtsCount > 0 ? true : false"
        />
        <span class="label">
          <span class="i"><img src="@/assets/images/logo_azure.svg" alt="AZURE" /></span>
          <span class="t">
            <strong>AZURE</strong>
            <span>{{ azureCtrtsCount }} Accounts</span>
          </span>
        </span>
      </label>
      <!-- //radio -->
      <!-- radio -->
      <label class="radio">
        <input
          type="radio"
          name="cspTypCd"
          value="GCP"
          :checked="cspTypCd === 'GCP'"
          :disabled="gcpCtrtsCount > 0 ? false : true"
          @click="gcpCtrtsCount > 0 ? true : false"
        />
        <span class="label">
          <span class="i"><img src="@/assets/images/logo_gcp.svg" alt="GCP" /></span>
          <span class="t">
            <strong>GCP</strong>
            <span>{{ gcpCtrtsCount }} Accounts</span>
          </span>
        </span>
      </label>
      <!-- //radio -->
      <button class="btn jsBtnClose2" @click="handleCspTypeChange(null)">{{ $t('common.button.apply') }}</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    current: {
      type: String,
      default: null,
    },
    awsCtrtsCount: {
      type: Number,
      default: 0,
      validator: this.typeNumberValidator,
    },
    azureCtrtsCount: {
      type: Number,
      default: 0,
      validator: this.typeNumberValidator,
    },
    gcpCtrtsCount: {
      type: Number,
      default: 0,
      validator: this.typeNumberValidator,
    },
  },
  data() {
    return {
      cspTypCd: 'AWS',
    };
  },
  created() {
    this.cspTypCd = this.current;
  },
  mounted() {
    const btnShows = document.querySelectorAll('.jsBtnShow1');
    btnShows.forEach((btnShow) => {
      btnShow.onclick = function () {
        if (this.parentNode.classList.contains('active')) {
          this.parentNode.classList.remove('active');
        } else {
          for (let i = 0; i < btnShows.length; i++) {
            btnShows[i].parentNode.classList.remove('active');
          }
          this.parentNode.classList.add('active');
        }
      };
    });
    const btn2Closes = document.querySelectorAll('.jsBtnClose2');
    btn2Closes.forEach((btn2Close) => {
      btn2Close.onclick = function () {
        this.parentNode.parentNode.classList.remove('active');
      };
    });
  },
  methods: {
    typeNumberValidator(value) {
      return typeof value === 'number';
    },
    handleCspTypeChange(value) {
      let cspTypCd = '';
      if (value === null) {
        const radioList = document.getElementsByName('cspTypCd');
        radioList.forEach((node) => {
          if (node.checked) {
            cspTypCd = node.value;
          }
        });
      } else {
        cspTypCd = value;
      }

      this.cspTypCd = cspTypCd;
      this.$emit('cspTypeChanged', this.cspTypCd);
    },
  },
};
</script>
