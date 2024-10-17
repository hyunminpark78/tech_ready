<template>
  <div class="relative flex items-center justify-center w-full min-h-screen overflow-hidden">
    <div class="item">
      <svg
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 310 350"
      >
        <path
          d="M156.4,339.5c31.8-2.5,59.4-26.8,80.2-48.5c28.3-29.5,40.5-47,56.1-85.1c14-34.3,20.7-75.6,2.3-111  c-18.1-34.8-55.7-58-90.4-72.3c-11.7-4.8-24.1-8.8-36.8-11.5l-0.9-0.9l-0.6,0.6c-27.7-5.8-56.6-6-82.4,3c-38.8,13.6-64,48.8-66.8,90.3c-3,43.9,17.8,88.3,33.7,128.8c5.3,13.5,10.4,27.1,14.9,40.9C77.5,309.9,111,343,156.4,339.5z"
        />
      </svg>
    </div>

    <div class="item item2">
      <svg
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 310 350"
      >
        <path
          d="M156.4,339.5c31.8-2.5,59.4-26.8,80.2-48.5c28.3-29.5,40.5-47,56.1-85.1c14-34.3,20.7-75.6,2.3-111  c-18.1-34.8-55.7-58-90.4-72.3c-11.7-4.8-24.1-8.8-36.8-11.5l-0.9-0.9l-0.6,0.6c-27.7-5.8-56.6-6-82.4,3c-38.8,13.6-64,48.8-66.8,90.3c-3,43.9,17.8,88.3,33.7,128.8c5.3,13.5,10.4,27.1,14.9,40.9C77.5,309.9,111,343,156.4,339.5z"
        />
      </svg>
    </div>

    <div class="item item3">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M42,-39.1C58.1,-25.8,77.4,-12.9,82.1,4.7C86.7,22.2,76.7,44.5,60.6,55.3C44.5,66.2,22.2,65.8,-0.1,65.9C-22.5,66,-45,66.7,-58.8,55.8C-72.6,45,-77.8,22.5,-74.7,3.2C-71.5,-16.1,-59.9,-32.3,-46.1,-45.6C-32.3,-58.9,-16.1,-69.3,-1.6,-67.7C12.9,-66.1,25.8,-52.4,42,-39.1Z"
          transform="translate(100 100)"
        />
      </svg>
    </div>

    <div class="item item4">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M49.2,-58C55.7,-53.2,47.3,-30,49.6,-9.8C51.9,10.4,64.9,27.7,60.5,34.5C56.1,41.4,34.3,37.9,18.4,38.4C2.6,38.8,-7.4,43.2,-15.7,41.1C-24,38.9,-30.7,30.3,-43.5,19.6C-56.3,8.9,-75.2,-3.9,-73.7,-13.2C-72.3,-22.5,-50.5,-28.3,-34.8,-31.5C-19.1,-34.7,-9.6,-35.1,5.9,-42.2C21.4,-49.2,42.7,-62.8,49.2,-58Z"
          transform="translate(100 100)"
        />
      </svg>
    </div>

    <Logo :user="user" class="fixed top-0 left-0 mt-4 ml-5" />

    <section class="flex flex-col items-center text-center">
      <div class="relative">
        <img src="@/assets/images/error-img-01.svg" alt="." />
        <img src="@/assets/images/error-img-02.svg" alt="." class="absolute magnifying-glass" />
      </div>
      <h2 class="mb-4 text-2xl font-bold text-primary-400 mt-7">잘못된 페이지 접근</h2>
      <p class="text-primary-600 mb-7">
        페이지의 주소가 잘못 입력되었거나,<br />
        페이지의 주소가 변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.
      </p>
      <RouterLink :to="{ name: 'Index' }" class="px-10 py-4 text-xl font-bold text-white rounded bg-primary-400">
        Cloud Radar로 바로가기
      </RouterLink>
    </section>

    <footer class="fixed bottom-0 right-0 mb-8 mr-8 text-gray-600 text-xs-">ⓒSK Telecom</footer>
  </div>
</template>

<script>
import Logo from '@/components/Header/Logo.vue';
import {getLocal} from "@/library/Common";

export default {
  components: { Logo },
  data() {
    return {
      user: {
        name: getLocal('userInfo') ? getLocal('userInfo').userNm : '홍길동',
        department: getLocal('userInfo') ? getLocal('userInfo').userCopNm : 'SKT',
        redirectRoute:  getLocal('userInfo') ? getLocal('userInfo').redirectRoute : '/dashboard',
      },
    };
  },
};
</script>
