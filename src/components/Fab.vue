<template>
  <div @click="$emit('goPageFaq')">
    <a class="z-10 bg-secondary fixed-link cursor-pointer">
      <img :src="require('@/assets/images/ico-faq-bg.svg')" alt="faq" />
      <span class="mt-1">자주묻는<br />질문들</span>
    </a>
    <!-- <a class="z-10 bg-tertiary fixed-link">
      <img :src="require('@/assets//images/ico-calculator-bg.svg')" alt="calculator" />
      <span class="mt-1">요금<br />계산기</span>
    </a> -->
  </div>
</template>

<script>
export default {};
</script>
