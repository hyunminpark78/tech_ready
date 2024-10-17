<template>
  <div class="filter__container">
    <div class="filter__wrapper">
      <div class="filter__content">
        <div class="upclose"></div>
        <div class="filter__content__reset">
          <button>
            <img src="@/assets/images/reset-01.svg" alt="다음 페이지" />
          </button>
          <p>{{ $t('advisor.gpuSPot.gpuSpotFilter.reset') }}</p>
        </div>
        <div class="filter__content__searchInput">
          <div class="filter__content__searchInput__account">
            <div class="input-wrapper">
              <div class="input-wrapper__label">
                <img class="required" src="@/assets/images/required-01.svg" alt="다음 페이지" />
                <p class="title">{{ $t('advisor.gpuSPot.gpuSpotFilter.account') }}</p>
              </div>
              <Select
                v-model="selectedAccount"
                div-class="input"
                :data="contractAndAccount"
                :text-getter="(item) => item.name"
                :key-getter="(item) => item.id"
                select-class="flex items-center justify-between w-full font-bold text-gray-700"
                :placeholder="$t('advisor.gpuSPot.gpuSpotFilter.all')"
                :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
                arrow-class="ml-4"
                option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200 account-input"
                option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
                text-class="input-text"
                option-list-style="width: 100%; left: 0px"
              />
            </div>
            <img
              src="@/assets/images/restart-icon.svg"
              alt="다음 페이지"
              style="cursor: pointer"
              @click="clearSelectedAccount"
            />
          </div>
          <div class="filter__content__searchInput__region">
            <div class="input-wrapper">
              <p class="title">{{ $t('advisor.gpuSPot.gpuSpotFilter.region') }}</p>
              <DropDownMenuFilterRegion
                ref="regionSel"
                :data="regionData"
                :text-getter="(item) => item.nm"
                :key-getter="(item) => item.id"
                child-key="childKey"
                select-class="flex items-center justify-between w-full text-gray-700"
                :arrow-src="arrowSrc"
                arrow-class="ml-4"
                @change="handleAcntParamChange"
              />
            </div>

            <img
              src="@/assets/images/restart-icon.svg"
              alt="clear"
              style="cursor: pointer"
              @click="clearSelectedRegion"
            />
          </div>
        </div>
        <div class="filter__content__tabs">
          <Tab
            v-for="(tabLabel, index) in tabLabels"
            :key="index"
            :is-active="tab === index"
            :label="tabLabel"
            @click="switchTab(index)"
          />
        </div>
        <div class="filter__content__filter">
          <SliderFilter2
            v-if="tab === 1"
            :addtion-filter-option="addtionFilterOption"
            :additional-filter-detail-options="additionalFilterDetailOptions"
            :current-tab="currentTab"
          />
          <TableFilter v-else :selected-region="selectedRegion" />
        </div>
        <div class="filter__content__apply">
          <button class="cl">닫기</button>
          <button @click="[$emit('close-filter'), $emit('apply-filter')]">
            {{ $t('advisor.gpuSPot.gpuSpotFilter.apply') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Select from '@/components/Select';
import SliderFilter2 from '@/pages/Advisor/components/SliderFilter2.vue';
import TableFilter from '@/pages/Advisor/components/TableFilter.vue';
import DropDownMenuFilterRegion from '@/pages/Advisor/filterSelects/DropDownMenuFilterRegion.vue';
import demoData from '../../../../../public/locales/gpudemo.json';
import spotGPUService from '@/services/spotGPUService';
import Tab from './sections/GPUFilterTab.vue';

export default {
  components: { DropDownMenuFilterRegion, TableFilter, SliderFilter2, Select, Tab },
  props: {
    currentTab: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      tab: 0,
      tabLabels: [
        this.$t('advisor.gpuSPot.gpuSpotFilter.instanceTypeDirectly'),
        this.$t('advisor.gpuSPot.gpuSpotFilter.instanceTypeMatch'),
      ],
      contractAndAccount: [],
      regionList: [],
      azDefaultCheckedOption: true,
      cspTypCd: 'AWS',
      selectedAccount: null,
      selectedRegion: null,
      regionData: demoData.regionData,
      tableData: demoData.filterTableData,
      addtionFilterOption: [
        { id: 'manufacturere', name: 'GPU 제조업체' },
        { id: 'gpuType', name: 'GPU 유형' },
        { id: 'gpuChip', name: 'GPU 칩' },
      ],
      additionalFilterDetailOptions: {
        manufacturere: [
          { id: 0, name: 'AMD' },
          { id: 1, name: 'HABANA' },
          { id: 2, name: 'NVIDIA' },
          { id: 3, name: 'Xilinx' },
          { id: 4, name: 'amazon-web-services' },
        ],
        gpuType: [
          { id: 0, name: 'GPU' },
          { id: 1, name: 'FPGA' },
          { id: 2, name: 'inference' },
        ],
        gpuChip: [
          { id: 0, name: 'A100' },
          { id: 1, name: 'A10g' },
          { id: 2, name: 'H100' },
          // ... 기타 칩 옵션들
        ],
      },
    };
  },
  created() {
    this.settingFilter();
    this.settingInstanceTypeTable();
  },

  methods: {
    switchTab(activeTab) {
      this.tab = activeTab;
    },
    async settingFilter() {
      const result = await spotGPUService.fetchSpotGpuTopFilter({ cspTypCd: this.cspTypCd });
      this.contractAndAccount = result.data.data.ctrtList.flatMap((item) =>
        item.acntList.map((accInfo) => ({
          id: accInfo.id,
          name: `${accInfo.nm}(${accInfo.id})`,
        }))
      );

      this.regionList = result.data.data.regionList.map((item) => ({
        id: item.id,
        name: item.name,
      }));
    },
    async settingInstanceTypeTable() {
      const params = {
        regions: this.selectedRegion,
        numberOfInstances: this.selectedRegion,
        instanceType: this.selectedAccount,
      };
      const result = await spotGPUService.fetchSpotGpuInstanceTypeTable(params);
      console.log(result);
    },
    clearSelectedAccount() {
      this.selectedAccount = null;
    },
    clearSelectedRegion() {
      this.selectedRegion = null;
    },
  },
};
</script>

<style lang="scss">
.filter {
  &__container {
    position: absolute;
    z-index: 100;
    background: white;
    border-radius: 10px;
    top: 0px;
    left: 250px;
    min-width: 675px;
    max-height: 872px;
    box-shadow: 0 2px 4px 0 rgba(26, 227, 187, 0.04), 0 2px 20px 0 rgba(26, 227, 187, 0.12);
    overflow: auto;

    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
  }

  &__container::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &__reset {
      align-self: flex-end;

      font-size: 0.875rem;
      display: flex;
      flex-direction: row;
      gap: 0.25rem;
      align-items: center;
      cursor: pointer;

      p {
        color: #00a5ed;
      }
    }

    &__searchInput {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .input-wrapper {
        position: relative;
        padding: 0.5rem 1.75rem;
        width: 100%;
        margin-right: 1rem;
        border-radius: 0.5rem;
        border: 1px solid #e3ebf1;
        display: flex;
        align-items: center;

        &__label {
          position: relative;
        }

        .required {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: -15%;
        }

        .title {
          color: #5ba9ca;
          min-width: 3.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: -0.05rem;
          padding-right: 1.25rem;
          border-right: 1px solid #e9ebed;
        }

        .input {
          width: 100%;
          padding-left: 1.25rem;

          .input-text {
            color: #00a5ed;
            font-size: 1rem;
            font-weight: 400;
          }
        }
      }

      &__account {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      &__region {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      &__checkbox {
        align-self: flex-end;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        margin-right: 2rem;

        .label {
          font-size: 0.75rem;
          color: black;
          font-weight: 400;
        }
      }
    }

    &__tabs {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;

      .gpuTab {
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.5rem 0rem 0rem 0.5rem;
        border: 1px solid #e3ebf1;
        background: #f5f5f5;
        font-size: 0.875rem;
        text-align: center;
        cursor: pointer;

        &:last-child {
          border-radius: 0rem 0.5rem 0.5rem 0rem;
        }

        p {
          color: #888888;
          font-size: 14px;
        }
      }

      .active {
        border: 1px solid #00a5ed;
        background: #fff;

        p {
          color: #00a5ed;
          font-weight: 700;
        }
      }
    }

    &__filter {
      display: flex;
      flex-direction: column;

      .filter-slider {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;

        &__input {
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          .instance-family {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            height: 32px;

            .title {
              color: #999;
              font-size: 0.875rem;
              font-weight: 500;
            }

            .input {
              display: flex;
              flex-direction: row;
              width: 262px;

              .input-filter {
                position: relative;
                border-radius: 0.25rem;
                border: 1px solid #e9ebed;
                background: white;
                padding: 0 1rem;
                margin-right: 1rem;
                width: 100%;
                height: 32px;

                button {
                  height: 100%;
                }

                .input-text {
                  color: #00a5ed;
                  font-size: 0.875rem;
                  font-weight: 400;
                }
              }
            }
          }
        }

        &__content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        &__filter-props {
          .wrapper {
            display: flex;
            flex-direction: row;
          }

          .input-wrapper {
            position: relative;

            padding: 0.5rem 1.75rem;
            flex-grow: 1;
            margin-right: 1rem;
            border-radius: 0.5rem;
            border: 1px solid #e3ebf1;
            display: flex;
            align-items: center;

            .title {
              min-width: 5rem;
              font-size: 0.875rem;
              font-weight: 500;
              letter-spacing: -0.05rem;
              padding-right: 1.25rem;
              color: #5ba9ca;
            }

            .input {
              width: 100%;
              padding-left: 1.25rem;

              .input-text {
                color: #00a5ed;
                font-size: 1rem;
                font-weight: 400;
              }

              ul {
                width: 100% !important;
                top: -9.8rem;
              }
            }
          }

          .filter-btn {
            margin-right: 1.25rem;
            padding: 0.0625rem 1rem;
            color: var(--Text-Gray-999, #999);
            text-align: center;
            font-size: 0.875rem;
            font-weight: 400;
            border-radius: 0.5rem;
            border: 1px solid var(--Border-Gray-Border, #e9ebed);
            background: var(--True-White, #fff);
          }

          .warning {
            margin-top: 0.75rem;
          }
        }
      }
    }

    &__apply {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      button {
        //max-width: 4.5625rem;
        padding: 0.0625rem 1.47rem;
        border-radius: 0.25rem;
        background: var(--Primary-Blue, #00a5ed);
        font-size: 0.875rem;
        color: var(--White, var(--True-White, #fff));
        font-weight: 700;
        text-align: center;
        line-height: 2.125rem;
      }
    }
  }

  &__wrapper {
    padding: 1rem 2rem;
  }
}

.required {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.13rem;
}

.account-input {
  max-height: 500px;
  overflow: auto;
}
</style>
