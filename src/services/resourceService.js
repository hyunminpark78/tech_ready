import APICaller from '@/library/APICaller';

/**
 * 20. usage_aws_chart_pie_current
 */
function fetchUsagChart(param, config) {
  return APICaller.post('/cap/v1/ocp/resource/usag/chart', param, config);
}
/**
 * 21. usage_aws_grid_current
 */
function fetchUsagGrid(param, config) {
  return APICaller.post('/cap/v1/ocp/resource/usag/grid', param, config);
}

/**
 *  /detail/tag
 */
function fetchDetailTag(param) {
  return APICaller.post('/cap/v1/ocp/resource/detail/tag', param);
}

/**
 *  /detail/describe
 */
function fetchDetailDescribe(param) {
  return APICaller.post('/cap/v1/ocp/resource/detail/describe', param);
}

export default {
  fetchUsagChart,
  fetchUsagGrid,
  fetchDetailTag,
  fetchDetailDescribe,
};
