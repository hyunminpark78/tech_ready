import Vue from 'vue';

export default Vue.extend({
  template: `
  <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
     <div class="mb-4 loading_rotate">
     <span class="loadingcolor"></span>
     </div>
     <div class="loading_txt">Loading...</div>
  </div>
    `,
});
