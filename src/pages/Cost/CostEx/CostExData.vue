<template>
  <!-- right -->
  <div class="gird-right">
    <!-- box-->
    <div class="box-wrap type2">
      <!-- title -->
      <div class="title">
        <div class="tab type2">
          <a
            href="#"
            class="
                  inline-block
                  rounded
                  mw60
                  py-1
                  text-center text-white
                  font-bold
                  bg-primary-400
                  border border-primary-400
                  text-sm
                "
          >USD</a
          >
          <a
            href="#"
            class="
                  inline-block
                  rounded
                  mw60
                  py-1
                  text-center text-primary-400
                  font-bold
                  bg-white
                  border border-primary-400
                  text-sm
                  ml-1.5
                "
          >KRW</a
          >
          <!-- tooltip -->
          <div class="tooltip-wrap inline-block">
            <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
            <div class="tooltip-layer">
              <strong class="ti">환율</strong>
              <div class="ls">대상기간에 포함되는 AWS 3일 인보이스 발행일 기준</div>
              <div class="ls">2023년 5월 : 1335.4119</div>
              <button class="close jsTooltipClose1">툴팁 닫기</button>
            </div>
          </div>
          <!-- //tooltip -->
        </div>
        <div class="total">
          <span>Total</span>
          <strong>$40194.78</strong>
        </div>
        <div class="pos-right type2">
              <span class="tab-wrap">
                <a href="#" class="bar clicked">bar chart</a>
                <a href="#" class="line">line chart</a>
              </span>
          <button class="fold jsFold1"><span>접기</span></button>
        </div>
      </div>
      <!-- //title -->
      <div class="detail">
        <p class="info">
          사용 기록을 수집하여 추정한 요금으로 계약 조건, 환율, 절사 방식, 서비스 제공 업체의 요금 확정 여부 등에 따라
          실제 청구 요금과 다를 수 있습니다.
        </p>
        <div
          style="
                background-color: #e3ebf1;
                font-size: 24px;
                letter-spacing: -0.03px;
                text-align: center;
                color: #fff;
                line-height: 318px;
                height: 318px;
              "
        >
          Chart
        </div>
      </div>
    </div>
    <!-- //box-->



    <!-- box -->
    <div class="box-wrap">
      <div class="title">
        <!-- search -->
        <div class="search-wrap">
          <input type="text" placeholder="검색어를 입력하세요" class="keyword" />
          <a href="#" class="btn">검색</a>
        </div>
        <!-- //search -->
        <div class="pos-right">
          <a href="#" class="download">다운로드(엑셀)</a>
          <button class="fold jsFold1"><span>접기</span></button>
        </div>
      </div>
      <div
        style="
              background-color: #e3ebf1;
              font-size: 24px;
              letter-spacing: -0.03px;
              text-align: center;
              color: #fff;
              line-height: 650px;
              height: 650px;
            "
      >
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :grid-options="gridOptions"
          :row-data="rowData"
          :column-defs="columnDefs"
          :default-col-def="defaultColDef"
          :dom-layout="domLayout"
          :modules="modules"
          :framework-components="frameworkComponents"
          :loading-overlay-component="loadingOverlayComponent"
          :loading-overlay-component-params="loadingOverlayComponentParams"
          :no-rows-overlay-component="noRowsOverlayComponent"
          :no-rows-overlay-component-params="noRowsOverlayComponentParams"
          :popup-parent="popupParent"
          :suppress-context-menu="true"
          :pagination="true"
          :auto-height="true"
          :pagination-page-size="pageObj.pageSize"
          :suppress-pagination-panel="true"
          :suppress-scroll-on-new-data="true"
          :default-excel-export-params="defaultExcelExportParams"
          @first-data-rendered="autoSizeAll"
          @row-data-changed="autoSizeAll"
          @grid-ready="onGridReady"
        ></ag-grid-vue>
      </div>
    </div>
    <!-- //box -->
  </div>
  <!-- //right -->
</template>

<script>
import resourceOptiService from "@/services/resourceOptiService";
import { mapActions, mapState } from 'vuex';

export default {
  name: "CostExDataGrid",

  data() {
    return {
      gridOptions: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: null,
      exchangeRate: 0,
    };
  },

  methods: {
    ...mapActions('costEx', ['ocpCostExplorerDatas']),
    async setGridData() {
      this.loading = true;
      this.param.periodType = this.periodType;
      this.param.gridType = this.type;

      try {
        this.rowData = await this.ocpCostExplorerDatas(this.param).then((result) => {
          result.data;
        });
      } catch (error) {
        console.error('Error fetching grid data:', error);
        this.rowData = [];
      } finally {
        this.loading = false;
        // this.autoSizeAll();
      }
    },
  },


}
</script>
