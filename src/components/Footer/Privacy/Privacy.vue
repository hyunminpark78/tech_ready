<template>
  <div>
    <!-- Cloud Radar 개인정보처리방침 -->
    <div class="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black bg-opacity-75-"></div>
    <section class="z-30 p-8 rounded policy-content">
      <h2 class="mb-4 text-2xl text-primary-400">Cloud Radar 개인정보처리방침</h2>

      <button class="absolute top-0 right-0 close-policy-modal mt-7 mr-7">
        <img src="@/assets/images/ico-btn-search-close.svg" alt="." @click="$emit('close')" />
      </button>
      <p class="my-6 text-sm text-gray-700">
        Cloud Radar 서비스(이하 “서비스”라 한다)와 관련하여, 본인은 동의내용을 숙지하였으며, 이에 따라 본인의 개인정보를
        귀사(SK텔레콤주식회사)가 수집 및 이용하는 것에 대해 동의합니다.
      </p>

      <div class="flex overflow-hidden border-b rounded border-primary-200">
        <div class="flex-1">
          <div class="py-5 text-sm font-bold text-center text-white bg-primary-400">수집∙이용목적</div>
          <div class="p-5 text-sm text-gray-600 border-l border-primary-200">
            <p class="mb-6">
              서비스 이용(가입/변경/해지 등 포함)을 위한 고객식별 및 회원관리, 본인여부 확인, 청구서 송부 및 Cloud Radar
              대시보드,사용분석의 정보 제공
            </p>
            <p>서비스와 관련된 중요사항 안내, 고객 문의 대응 등의 의사소통에 이용</p>
          </div>
        </div>
        <div class="flex-1 border-l border-r border-primary-200">
          <div class="py-5 text-sm font-bold text-center text-white bg-primary-400">수집항목</div>
          <div class="p-5 text-sm text-gray-600">
            <p class="mb-6">이메일(아이디), 비밀번호(Password)</p>
            <p>담당자명, 담당자 이메일 주소, 고객사명(회사명), 사업자등록번호</p>
          </div>
        </div>
        <div class="flex-1">
          <div class="py-5 text-sm font-bold text-center text-white bg-primary-400">보유 및 이용기간</div>
          <div class="p-5 text-sm text-gray-600 border-r border-primary-200">
            <p>서비스 제공기간(단, 정산이 미완료된 경우, 정산완료일로 부터 6개월까지 또는 분쟁이 종료되는 때까지)</p>
          </div>
        </div>
      </div>
      <p class="mt-6 mb-2 text-xs text-gray-600">
        ※ 본 동의는 서비스의 본질적 기능 제공을 위한 개인정보 수집/이용에 대한 동의로서, 동의하지 않으실 경우 서비스
        제공이 불가능합니다.
      </p>
      <p class="text-xs text-gray-600">
        ※ 법령에 따른 개인정보의 수집/이용, 계약의 이행/편의증진을 위한 개인정보 취급위탁 및 개인정보 취급과 관련된 일반
        사항은
        <a
          href="https://privacy.sktelecom.com/view.do?ctg=policy&name=principles"
          class="underline text-primary-400"
          target="_blnak"
          >통합 개인정보 처리방침</a
        >
        에 따릅니다.
      </p>
    </section>
  </div>
</template>

<script>
export default {};
</script>
