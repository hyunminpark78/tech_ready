<template>
  <div class="box-wrap">
    <div class="title bb1">
      <h4 class="tit-wrap">{{ $t('setting.generateClientSecretValue') }}</h4>
      <p class="txt">
        {{ $t('setting.selectNewClientSecret') }}
      </p>
      <div class="img">
        <img src="@/assets/images/img-azure-regist-step5-1.jpg" alt="애플리케이션 수정" />
      </div>
      <p class="txt">{{ $t('setting.checkSecretPassword') }}</p>
      <div class="img">
        <img src="@/assets/images/img-azure-regist-step5-2.jpg" alt="애플리케이션 수정" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AzureAcctUpdateGuide',
};
</script>
<style scoped>
div.img {
  margin-bottom: 20px;
}
</style>
