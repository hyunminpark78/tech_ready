<template>
  <div ref="amChartArea" :style="styleObject"></div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as utils from 'openitlibrary/src/library/commonUtil';
import constants from '@/pages/Contract/cards/colorConstants';
import { numberWithCommas } from 'openitlibrary/src/library/regexp';
import _ from 'lodash';
import { i18n } from '../../../../public/locales/i18n';

am4core.useTheme(am4themes_animated);
am4core.options.commercialLicense = true;

export default {
  name: 'GAreaPerformanceChart',
  componentName: 'GAreaPerformanceChart',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    chartHeight: {
      type: String,
      default: '200',
    },
    chartTheme: {
      type: String,
      default: '',
    },
    chartStyle: {
      type: Array,
      default: () => [],
    },
    chartType: {
      type: String,
      default: 'default',
    },
    chartLocation: {
      type: String,
      default: '',
    },
    customKeys: {
      type: Array,
      default: () => [],
    },
    propsInfo: {
      type: Object,
      default: () => ({
        dateProp: '',
        keyProp: '',
        nameProp: '',
        valueProp: '',
      }),
    },
    curcyCode: {
      type: String,
      default: 'KRW',
    },
    propsChartOption: {
      type: Object,
      default: () => ({
        isNumberFormat: false,
        numberFormat: '',
        numberFix: [
          { number: 1e3, suffix: 'k' },
          { number: 1e6, suffix: 'M' },
          { number: 1e9, suffix: 'B' },
          { number: 1e12, suffix: 'T' },
        ],
        prefixed: '',
        colors: [],
        fontColor: '#6c9fb2',
        legend: {
          isUse: false,
          position: 'bottom',
          align: 'center',
          valign: 'center',
          backgroundColor: '',
          backgroundOpacity: 0,
          minWidth: 300,
          width: 300,
          height: 100,
          fontSize: 11,
          labelColor: '#666666',
          clickAble: false,
          focusAble: false,
          showData: false,
          isLimitLegend: false,
        },
        cateAxis: {
          isUse: true,
          multiValueAxis: true,
          gridDistance: 20,
          fontSize: 10,
          lineWeight: 0,
          lineLocation: 0,
          isLegendCustom: false,
          axisHide: false,
          tooltipHide: false,
          prefix: '',
          suffix: '',
        },
        valueAxis: {
          isUse: true,
          gridDistance: 20,
          fontSize: 10,
          stacked: false,
          calculate: false,
          lineWeight: 0,
          lineLocation: 0,
          axisHide: false,
          tooltipHide: false,
          valueTitle: '',
          titlePadding: 20,
          prefix: '',
          suffix: '',
        },
        series: {
          isUse: true,
          isCustom: false,
          isStack: false,
          valueShow: '',
          isTotalTooltip: false,
          isCustomTooltip: false,
          totalTooltipCont: '',
          tooltipType: 'default',
          tooltipCont: '{name}: [bold]{valueY.total}[/]',
          fillOpacity: 0,
          strokeWidth: 2,
          strokeDasharray: 0,
          isRangeArea: false,
          customName: [],
          isGradation: false,
          color: '#C6C3C4',
          prefix: '',
          suffix: '',
          bullet: {
            isUse: false,
          },
        },
        tooltip: {
          isUse: false,
        },
        cursor: {
          isUse: true,
          isCustom: false,
          isHiddenLine: false,
        },
      }),
    },
  },
  data() {
    return {
      chart: null,
      chartOption: {},
      categoryName: 'timeStmp',
      totalPrice: 0,
    };
  },
  computed: {
    styleObject() {
      return {
        height: this.chartHeight + 'px',
      };
    },
  },
  watch: {
    '$i18n.locale': 'setChartInfo',
    data: function (newData) {
      this.setChartInfo(newData);
    },
    totalPrice: function (data) {
      this.$emit('total-price', numberWithCommas(data));
    },
    chartTheme: function (newVal, oldVal) {
      this.setChartInfo(this.data);
    },
  },
  created() {
    this.chartOption = this.propsChartOption;
  },
  mounted() {
    this.setChartInfo(this.data);
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
  methods: {
    setChartInfo(data) {
      /**
       차트 옵션 세팅
       */
      if (
        this.chartTheme === 'ec2' ||
        this.chartTheme === 'rds' ||
        this.chartTheme === 'Microsoft.Compute/virtualMachines' ||
        this.chartTheme === 'Microsoft.DBforMySQL/flexibleServers' ||
        this.chartTheme === 'Microsoft.Storage/storageAccounts'
      ) {
        this.chartOption.legend.isUse = true;
        this.chartOption.legend.position = 'bottom';
        this.chartOption.legend.width = 500;
        this.chartOption.legend.height = 500;
        this.chartOption.legend.fontSize = 14;

        this.chartOption.cateAxis.gridDistance = 80;
        this.chartOption.cateAxis.multiValueAxis = true;
        this.chartOption.cateAxis.fontSize = 13;
        this.chartOption.cateAxis.axisHide = false;
        this.chartOption.cateAxis.tooltipHide = true;

        this.chartOption.valueAxis.gridDistance = 10;
        this.chartOption.valueAxis.fontSize = 13;
        this.chartOption.valueAxis.calculate = true;
        this.chartOption.valueAxis.axisHide = true;
        this.chartOption.valueAxis.tooltipHide = true;
        this.chartOption.valueAxis.lineWeight = 0.1;
        this.chartOption.valueAxis.strokeOpacity = 0.1;
        this.chartOption.numberFormat = '#a%';

        this.chartOption.cursor.isUse = true;
        this.chartOption.cursor.isHiddenLine = true;

        this.chartOption.series.bullet.isUse = true;
        this.chartOption.series.isTotalTooltip = false;
        this.chartOption.series.fillOpacity = 0;
        this.chartOption.series.tooltipCont = '{valueY.value}';
        this.chartOption.series.tooltipType = 'default';
      } else if (this.chartTheme === 'ebs') {
        this.chartOption.legend.isUse = true;
        this.chartOption.legend.position = 'bottom';
        this.chartOption.legend.width = 500;
        this.chartOption.legend.height = 500;
        this.chartOption.legend.fontSize = 14;

        this.chartOption.cateAxis.gridDistance = 80;
        this.chartOption.cateAxis.multiValueAxis = false;
        this.chartOption.cateAxis.fontSize = 13;
        this.chartOption.cateAxis.axisHide = false;
        this.chartOption.cateAxis.tooltipHide = true;

        this.chartOption.valueAxis.gridDistance = 10;
        this.chartOption.valueAxis.fontSize = 13;
        this.chartOption.valueAxis.calculate = true;
        this.chartOption.valueAxis.axisHide = true;
        this.chartOption.valueAxis.tooltipHide = true;
        this.chartOption.valueAxis.lineWeight = 0.1;
        this.chartOption.valueAxis.strokeOpacity = 0.1;
        this.chartOption.numberFormat = '#a';

        this.chartOption.cursor.isUse = true;
        this.chartOption.cursor.isHiddenLine = true;

        this.chartOption.series.bullet.isUse = true;
        this.chartOption.series.isTotalTooltip = false;
        this.chartOption.series.fillOpacity = 0;
        this.chartOption.series.tooltipCont = '{valueY.value}';
        this.chartOption.series.tooltipType = 'default';
      }

      this.createChart(this.data);
    },
    createChart(data) {
      if (this.chart) {
        this.chart.dispose();
      }

      let keys;
      let rowData = _.cloneDeep(data);

      if (this.customKeys.length > 0) {
        keys = this.customKeys;
      } else {
        keys = utils.getKeys(data, this.propsInfo);
        // rowData = utils.convertChartData(rowData, keys, this.propsInfo);
      }

      const chart = am4core.create(this.$refs.amChartArea, am4charts.XYChart);

      chart.fontFamily = 'AppleSDGothicNeo';
      chart.paddingTop = 30;
      chart.paddingBottom = 0;
      chart.paddingLeft = 0;
      chart.paddingRight = 20;
      chart.minHeight = this.chartHeight ? this.chartHeight - 10 : 227;

      chart.data = rowData;
      this.chartOption.colors = constants.COLOR_LIST;
      /* AREA COLOR SETTING */
      if (this.chartOption.colors.length > 0) {
        let colors = [];
        this.chartOption.colors.forEach((e) => colors.push(am4core.color(e)));
        chart.colors.list = colors;
      }

      /* Category Axes Setting (가로 축) */
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = this.categoryName;
      categoryAxis.renderer.minGridDistance = this.chartOption.cateAxis.gridDistance;
      categoryAxis.tooltip.disabled = this.chartOption.cateAxis.tooltipHide;
      categoryAxis.renderer.grid.template.strokeOpacity = this.chartOption.cateAxis.lineWeight;
      categoryAxis.renderer.labels.template.disabled = this.chartOption.cateAxis.axisHide;
      categoryAxis.renderer.labels.template.fontSize = this.chartOption.cateAxis.fontSize;
      categoryAxis.renderer.labels.template.fill = this.chartOption.fontColor;
      categoryAxis.renderer.labels.template.adapter.add('textOutput', function (text) {
        return text.replace(/-/g, '/');
      });

      categoryAxis.renderer.grid.template.disabled = false; // 기본값이 false이므로 이 줄은 선택사항입니다.
      categoryAxis.renderer.grid.template.stroke = am4core.color('#CBCBCB'); // 점선 색상 설정
      categoryAxis.renderer.grid.template.strokeWidth = 0.4; // 선 두께 설정
      categoryAxis.renderer.grid.template.strokeOpacity = 1; // 점선의 투명도
      categoryAxis.renderer.grid.template.strokeDasharray = '3,3'; // 점선 스타일 (3픽셀 그리고 3픽셀 건너뛰기)
      if (this.chartTheme === 'rds') {
        /* MULTI VALUE AXES 전용 */
        keys.forEach((key, index) => {
          let customKey = '';
          let title = '';
          let tPadding = '';
          let titleColor = '';
          if (key.key === 'cpu') {
            customKey = i18n.locale === 'ko' ? 'CPU 사용률' : 'CPU usage';
            title = i18n.locale === 'ko' ? 'CPU 사용률' : 'CPU usage';
            titleColor = '#2cc2fd';
            tPadding = 10;
          } else if (key.key === 'mem') {
            title = i18n.locale === 'ko' ? '사용가능 메모리' : 'Available memory';
            customKey = i18n.locale === 'ko' ? '사용가능 메모리' : 'Available memory';
            titleColor = '#1ae3bb';
            tPadding = 10;
          } else if (key.key === 'disk') {
            title = i18n.locale === 'ko' ? '사용가능 저장소 공간' : 'Available storage space';
            customKey = i18n.locale === 'ko' ? '사용가능 저장소 공간' : 'Available storage space';
            titleColor = '#fc5aa1';
            tPadding = 0;
          }
          let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          if (chart.yAxes.indexOf(valueAxis) !== 0) {
            valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
          }
          valueAxis.renderer.opposite = index === 0 ? false : true;
          valueAxis.renderer.labels.template.disabled = false;
          valueAxis.tooltip.disabled = this.chartOption.valueAxis.tooltipHide;
          valueAxis.calculateTotals = this.chartOption.valueAxis.calculate;
          valueAxis.renderer.labels.template.fontSize = this.chartOption.valueAxis.fontSize;
          valueAxis.renderer.line.strokeOpacity = 1;
          valueAxis.renderer.line.strokeWidth = 1;
          valueAxis.renderer.baseGrid.disabled = false;
          valueAxis.renderer.grid.template.strokeOpacity = 0.1;
          valueAxis.renderer.labels.template.fill = am4core.color('#6c9fb2');

          /*if (k.key !== 'instsCnt') {
            /!* 차트 VALUE FORMAT 수정 *!/
            valueAxis.numberFormatter = new am4core.NumberFormatter();
            valueAxis.numberFormatter.numberFormat = this.chartOption.numberFormat;
          }*/

          valueAxis.layout = 'absolute';
          valueAxis.title.text = title;
          valueAxis.title.rotation = 0;
          valueAxis.title.dy = -30;
          valueAxis.title.dx = tPadding;
          valueAxis.title.fontSize = 13;
          valueAxis.title.align = 'center';
          valueAxis.title.valign = 'top';
          valueAxis.title.fontWeight = 600;
          valueAxis.title.fill = titleColor;

          if (key.key === 'cpu') {
            valueAxis.renderer.labels.template.adapter.add('text', function (text) {
              return text + '%';
            });
          } else {
            valueAxis.renderer.labels.template.adapter.add('text', function (text) {
              return text + 'MB';
            });
          }

          let series = chart.series.push(new am4charts.LineSeries());

          valueAxis.renderer.line.stroke = series.stroke;
          valueAxis.renderer.labels.template.fill = series.stroke;

          series.dataFields.categoryX = this.categoryName;
          series.dataFields.valueY = key.key;
          series.name = customKey;
          // series.dataFields.dateX = "xDate";
          series.yAxis = valueAxis;
          series.stacked = this.chartOption.series.isStack;
          series.strokeWidth = 0.8;
          series.tooltipText = '{name}: [bold]{valueY}[/]';
          series.showOnInit = true;
          series.tooltip.getStrokeFromObject = true;
          series.tooltip.getFillFromObject = false;
          series.tooltip.strokeOpacity = 1;
          series.tooltip.label.fill = am4core.color(chart.colors.list[index].hex);
          series.tooltip.background.fillOpacity = 1;
          series.tooltip.background.filters.clear();
          series.tooltip.fontSize = 12;

          let interfaceColors = new am4core.InterfaceColorSet();
          let bullet;
          switch (index) {
            case 0:
              bullet = series.bullets.push(new am4charts.Bullet());
              bullet.width = 10;
              bullet.height = 10;

              let triangle = bullet.createChild(am4core.Circle);
              triangle.stroke = interfaceColors.getFor('background');
              triangle.horizontalCenter = 'middle';
              triangle.verticalCenter = 'middle';
              triangle.width = 10;
              triangle.height = 10;
              break;

            case 1:
              bullet = series.bullets.push(new am4charts.Bullet());
              bullet.width = 10;
              bullet.height = 10;

              let rectangle = bullet.createChild(am4core.Circle);
              rectangle.stroke = interfaceColors.getFor('background');
              rectangle.strokeWidth = 1;
              rectangle.horizontalCenter = 'middle';
              rectangle.verticalCenter = 'middle';
              rectangle.width = 10;
              rectangle.height = 10;
              break;

            case 2:
              bullet = series.bullets.push(new am4charts.Bullet());
              bullet.width = 10;
              bullet.height = 10;

              let circle = bullet.createChild(am4core.Circle);
              circle.stroke = interfaceColors.getFor('background');
              circle.strokeWidth = 1;
              circle.horizontalCenter = 'middle';
              circle.verticalCenter = 'middle';
              circle.width = 10;
              circle.height = 10;
              break;

            default:
              bullet = series.bullets.push(new am4charts.CircleBullet());
              bullet.circle.stroke = interfaceColors.getFor('background');
              bullet.circle.strokeWidth = 1;
              rectangle.horizontalCenter = 'middle';
              rectangle.verticalCenter = 'middle';
              rectangle.width = 5;
              rectangle.height = 5;
              break;
          }
        });
        /* 커서 세팅 */
        if (this.chartOption.cursor.isUse) {
          chart.cursor = new am4charts.XYCursor();
          if (this.chartOption.series.isTotalTooltip) {
            chart.cursor.maxTooltipDistance = this.chartOption.series.isTotalTooltip ? -1 : 0;
          }

          if (this.chartOption.cursor.isHiddenLine) {
            chart.cursor.lineY.disabled = this.chartOption.cursor.isHiddenLine;
            chart.cursor.lineX.disabled = this.chartOption.cursor.isHiddenLine;
            chart.cursor.behavior = 'none';
          }
        }

        /* 범례(LEGEND)영역 세팅 */
        if (this.chartOption.legend.isUse) {
          chart.legend = new am4charts.Legend();
          chart.legend.position = this.chartOption.legend.position;
          chart.legend.contentAlign = this.chartOption.legend.align;
          chart.legend.valign = this.chartOption.legend.valign;
          chart.legend.minWidth = this.chartOption.legend.minWidth;
          chart.legend.maxWidth = 500;
          chart.legend.maxHeight = this.chartOption.legend.height;
          chart.legend.fontSize = this.chartOption.legend.fontSize;
          chart.legend.scrollable = true;
          chart.legend.labels.template.fill = this.chartOption.legend.labelColor;

          let markerTemplate = chart.legend.markers.template;
          markerTemplate.width = this.chartOption.legend.fontSize;
          markerTemplate.height = this.chartOption.legend.fontSize;
        }
      } else {
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        valueAxis.renderer.labels.template.disabled = false;
        valueAxis.tooltip.disabled = this.chartOption.valueAxis.tooltipHide;
        valueAxis.calculateTotals = this.chartOption.valueAxis.calculate;
        valueAxis.renderer.labels.template.fontSize = this.chartOption.valueAxis.fontSize;
        valueAxis.renderer.line.strokeOpacity = 1;
        valueAxis.renderer.line.strokeWidth = 1;
        valueAxis.renderer.baseGrid.disabled = false;
        valueAxis.renderer.grid.template.strokeOpacity = 0.1;
        valueAxis.renderer.labels.template.fill = am4core.color('#2cc2fd');

        if (this.chartTheme === 'ebs') {
          valueAxis.renderer.labels.template.adapter.add('text', function (text) {
            if (i18n.locale === 'ko') {
              return text + '개';
            } else {
              return text + 'unit(s)';
            }
          });
        } else if (this.chartTheme === 'Microsoft.Storage/storageAccounts') {
          valueAxis.renderer.labels.template.adapter.add('text', function (text) {
            return text + 'MB';
          });
        } else {
          valueAxis.numberFormatter = new am4core.NumberFormatter();
          valueAxis.numberFormatter.numberFormat = this.chartOption.numberFormat;
        }

        /* valueAxis.layout = "absolute";
        // valueAxis.title.text = "Unified Axis";
        valueAxis.title.rotation = 0;
        valueAxis.title.dy = -30;
        valueAxis.title.dx = 10;  // Adjust as needed
        valueAxis.title.fontSize = 13;
        valueAxis.title.align = "center";
        valueAxis.title.valign = "top";
        valueAxis.title.fontWeight = 600;
        valueAxis.title.fill = "#000000";  // Adjust as needed*/

        keys.forEach((key, index) => {
          let customKey = '';
          let title = '';
          let tPadding = '';
          let titleColor = '';

          if (this.chartTheme === 'ebs') {
            if (key.key === 'cpu') {
              customKey = 'Volume queue length';
              title = 'Volume queue length';
              titleColor = '#2cc2fd';
              tPadding = 10;
            } else if (key.key === 'mem') {
              title = 'Volume write IOPS';
              customKey = 'Volume write IOPS';
              titleColor = '#1ae3bb';
              tPadding = 10;
            } else if (key.key === 'disk') {
              title = 'Volume read IOPS';
              customKey = 'Volume read IOPS';
              titleColor = '#fc5aa1';
              tPadding = 0;
            }
          } else if (this.chartTheme === 'ec2') {
            if (key.key === 'cpu') {
              customKey = i18n.locale === 'ko' ? 'CPU 사용률' : 'CPU usage';
              title = i18n.locale === 'ko' ? 'CPU 사용률' : 'CPU usage';
              titleColor = '#2cc2fd';
              tPadding = 10;
            } else if (key.key === 'mem') {
              title = i18n.locale === 'ko' ? '메모리 사용률' : 'Memory usage';
              customKey = i18n.locale === 'ko' ? '메모리 사용률' : 'Memory usage';
              titleColor = '#1ae3bb';
              tPadding = 10;
            } else if (key.key === 'disk') {
              title = i18n.locale === 'ko' ? '디스크 공간 사용률' : 'Disk space usage';
              customKey = i18n.locale === 'ko' ? '디스크 공간 사용률' : 'Disk space usage';
              titleColor = '#fc5aa1';
              tPadding = 0;
            }
          } else if (this.chartTheme === 'Microsoft.Compute/virtualMachines') {
            if (key.key === 'line1') {
              customKey = i18n.locale === 'ko' ? 'CPU 사용률' : 'CPU usage';
              title = i18n.locale === 'ko' ? 'CPU 사용률' : 'CPU usage';
              titleColor = '#2cc2fd';
              tPadding = 10;
            } else if (key.key === 'line2') {
              title = i18n.locale === 'ko' ? '메모리 사용률' : 'Memory usage';
              customKey = i18n.locale === 'ko' ? '메모리 사용률' : 'Memory usage';
              titleColor = '#1ae3bb';
              tPadding = 10;
            } else if (key.key === 'line3') {
              title = i18n.locale === 'ko' ? '디스크 공간 사용률' : 'Disk space usage';
              customKey = i18n.locale === 'ko' ? '디스크 공간 사용률' : 'Disk space usage';
              titleColor = '#fc5aa1';
              tPadding = 0;
            }
          } else if (this.chartTheme === 'Microsoft.DBforMySQL/flexibleServers') {
            if (key.key === 'line1') {
              customKey = i18n.locale === 'ko' ? 'CPU 사용률' : 'CPU usage';
              title = i18n.locale === 'ko' ? 'CPU 사용률' : 'CPU usage';
              titleColor = '#2cc2fd';
              tPadding = 10;
            } else if (key.key === 'line2') {
              title = i18n.locale === 'ko' ? '메모리 사용률' : 'Memory usage';
              customKey = i18n.locale === 'ko' ? '메모리 사용률' : 'Memory usage';
              titleColor = '#1ae3bb';
              tPadding = 10;
            } else if (key.key === 'line3') {
              title = i18n.locale === 'ko' ? '스토리지 사용률' : 'Storage utilization';
              customKey = i18n.locale === 'ko' ? '스토리지 사용률' : 'Storage utilization';
              titleColor = '#fc5aa1';
              tPadding = 0;
            }
          } else if (this.chartTheme === 'Microsoft.Storage/storageAccounts') {
            if (key.key === 'line1') {
              customKey = i18n.locale === 'ko' ? '스토리지 사용량' : 'Storage usage';
              title = i18n.locale === 'ko' ? '스토리지 사용량' : 'Storage usage';
              titleColor = '#2cc2fd';
              tPadding = 10;
            }
          }

          let series = chart.series.push(new am4charts.LineSeries());

          /*valueAxis.renderer.line.stroke = series.stroke;
          valueAxis.renderer.labels.template.fill = series.stroke;*/

          series.dataFields.categoryX = this.categoryName;
          series.dataFields.valueY = key.key;
          series.name = customKey; // Replace with custom names if needed
          // series.dataFields.dateX = "xDate";
          series.yAxis = valueAxis;
          series.stacked = this.chartOption.series.isStack;
          series.strokeWidth = 0.8;
          series.tooltipText = '{name}: [bold]{valueY}[/]';
          series.showOnInit = true;
          series.tooltip.getStrokeFromObject = true;
          series.tooltip.getFillFromObject = false;
          series.tooltip.strokeOpacity = 1;
          series.tooltip.label.fill = am4core.color(chart.colors.list[index].hex);
          series.tooltip.background.fillOpacity = 1;
          series.tooltip.background.filters.clear();
          series.tooltip.fontSize = 12;

          // Add bullets, if needed, similar to the above code
          // ...
          let interfaceColors = new am4core.InterfaceColorSet();
          let bullet;
          switch (index) {
            case 0:
              bullet = series.bullets.push(new am4charts.Bullet());
              bullet.width = 10;
              bullet.height = 10;

              let triangle = bullet.createChild(am4core.Circle);
              triangle.stroke = interfaceColors.getFor('background');
              triangle.horizontalCenter = 'middle';
              triangle.verticalCenter = 'middle';
              triangle.width = 10;
              triangle.height = 10;
              break;

            case 1:
              bullet = series.bullets.push(new am4charts.Bullet());
              bullet.width = 10;
              bullet.height = 10;

              let rectangle = bullet.createChild(am4core.Circle);
              rectangle.stroke = interfaceColors.getFor('background');
              rectangle.strokeWidth = 1;
              rectangle.horizontalCenter = 'middle';
              rectangle.verticalCenter = 'middle';
              rectangle.width = 10;
              rectangle.height = 10;
              break;

            case 2:
              bullet = series.bullets.push(new am4charts.Bullet());
              bullet.width = 10;
              bullet.height = 10;

              let circle = bullet.createChild(am4core.Circle);
              circle.stroke = interfaceColors.getFor('background');
              circle.strokeWidth = 1;
              circle.horizontalCenter = 'middle';
              circle.verticalCenter = 'middle';
              circle.width = 10;
              circle.height = 10;
              break;

            default:
              bullet = series.bullets.push(new am4charts.CircleBullet());
              bullet.circle.stroke = interfaceColors.getFor('background');
              bullet.circle.strokeWidth = 1;
              rectangle.horizontalCenter = 'middle';
              rectangle.verticalCenter = 'middle';
              rectangle.width = 5;
              rectangle.height = 5;
              break;
          }
        });
        // Cursor settings
        if (this.chartOption.cursor.isUse) {
          chart.cursor = new am4charts.XYCursor();
          if (this.chartOption.series.isTotalTooltip) {
            chart.cursor.maxTooltipDistance = this.chartOption.series.isTotalTooltip ? -1 : 0;
          }
          if (this.chartOption.cursor.isHiddenLine) {
            chart.cursor.lineY.disabled = this.chartOption.cursor.isHiddenLine;
            chart.cursor.lineX.disabled = this.chartOption.cursor.isHiddenLine;
            chart.cursor.behavior = 'none';
          }
        }

        // Legend settings
        if (this.chartOption.legend.isUse) {
          chart.legend = new am4charts.Legend();
          chart.legend.position = this.chartOption.legend.position;
          chart.legend.contentAlign = this.chartOption.legend.align;
          chart.legend.valign = this.chartOption.legend.valign;
          chart.legend.minWidth = this.chartOption.legend.minWidth;
          chart.legend.maxWidth = 500;
          chart.legend.maxHeight = this.chartOption.legend.height;
          chart.legend.fontSize = this.chartOption.legend.fontSize;
          chart.legend.scrollable = true;
          chart.legend.labels.template.fill = this.chartOption.legend.labelColor;

          let markerTemplate = chart.legend.markers.template;
          markerTemplate.width = this.chartOption.legend.fontSize;
          markerTemplate.height = this.chartOption.legend.fontSize;
        }
      }
      this.chart = chart;
    },

    createLine(chart, key, index) {
      /**
       선형 그래프 각각의 선을 커스텀 할 경우,
       선마다 옵션값이 있어야 함
       */
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.categoryX = this.categoryName;

      series.name = key.title ? key.title : key.key;
      series.stacked = this.chartOption.series.isStack;
      series.dataFields.valueY = key.key;
      series.dataFields.valueYShow = this.chartOption.series.valueShow;

      series.fill = am4core.color(chart.colors.list[index].hex);
      series.fillOpacity = this.chartOption.series.fillOpacity;
      series.stroke = am4core.color(chart.colors.list[index].hex);
      series.strokeWidth = this.chartOption.series.strokeWidth;
      // series.strokeWidth = (index === 0 ) ? 0 : this.chartOption.series.strokeWidth;

      series.tooltip.getStrokeFromObject = true;
      series.tooltip.getFillFromObject = false;
      series.tooltip.strokeOpacity = 1;
      series.tooltip.label.fill = am4core.color(chart.colors.list[index].hex);

      /* 툴팁 BOX 투명도 */
      series.tooltip.background.fillOpacity = 1;
      series.tooltip.background.filters.clear();

      // series.legendSettings.labelText = "[" + this.chartOption.legend.labelColor + "] {name}[/]";
      /* 차트 MOUSE OVER시 해당 데이터 세팅 */
      /*if (this.chartOption.legend.showData) {
        series.legendSettings.itemValueText = "[bold]₩ {valueY.value}[/bold]";
      }*/

      if (this.chartOption.series.prefix !== '' || this.chartOption.series.suffix !== '') {
        let prefix = this.chartOption.series.prefix;
        let suffix = this.chartOption.series.suffix;
        series.renderer.labels.template.adapter.add('textOutput', function (text) {
          return ''.concat(prefix, text, suffix);
        });
      }

      /* INNER CHART CUSTOM TOOLTIPS CONTENTS */
      if (this.chartOption.series.isTotalTooltip) {
        series.adapter.add('tooltipHTML', (html, target) => {
          if (this.chartOption.series.totalTooltipCont !== '') {
            return this.chartOption.series.totalTooltipCont;
          }
          return (
            "<div><p class='custom_tooltip_date'>{categoryX}일\r\n</p><p class='custom_tooltip_value'>₩" +
            this.chartOption.series.tooltipCont +
            '</p></div>'
          );
        });
      } else {
        if (this.chartOption.series.tooltipType === 'default') {
          series.tooltipText = this.chartOption.series.tooltipCont;
          series.tooltip.fontSize = 12;
        } else if (this.chartOption.series.tooltipType === 'html') {
          series.tooltipHTML = this.chartOption.series.tooltipCont;
          series.tooltip.fontSize = 12;
        }
      }

      // let ltd = chart.data[chart.data.length - 1];
      // let price = ltd[key.key] ? ltd[key.key] : 0;
      // series.legendSettings.labelText = key.title + " ([font-size:14px] ₩" + numberWithCommas(parseFloat(price).toFixed(0)) + "[/])";

      // 그라데이션
      if (this.chartOption.series.isGradation) {
        let fillModifier = new am4core.LinearGradientModifier();
        fillModifier.opacities = [1, 0];
        fillModifier.offsets = [0, 0.9];
        fillModifier.gradient.rotation = 90;
        series.segments.template.fillModifier = fillModifier;
      }

      if (this.chartTheme === 'bill_trend') {
        series.connect = false;
      }

      return series;
    },
  },
};
</script>
