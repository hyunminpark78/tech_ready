import Vue from 'vue';

export default Vue.extend({
  template: `
  <div>
            <i class="far fa-frown" style="font-style: normal;">{{ $t('common.paragraph.noDataDisplay') }}</i>
   </div>
    `,
});
