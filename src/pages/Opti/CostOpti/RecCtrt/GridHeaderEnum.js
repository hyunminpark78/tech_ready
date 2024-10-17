import { i18n } from '../../../../../public/locales/i18n';

const TYPE = {
  title: {
    name: {
      ko: '결제 옵션',
      en: 'Payment options',
    },
    order: 1,
  },
  title_az: {
    name: {
      ko: '범위',
      en: 'Range',
    },
    order: 1,
  },

  _1yr: {
    name: {
      ko: '1년',
      en: '1-year',
    },
    order: 2,
  },
  _3yr: {
    name: {
      ko: '3년',
      en: '3-year',
    },
    order: 3,
  },

  // AWS SP
  EC2_1yr: {
    name: {
      ko: '1년, EC2',
      en: '1-year, EC2',
    },
    order: 2,
  },
  Compute_1yr: {
    name: {
      ko: '1년, Compute',
      en: '1-year, Compute',
    },
    order: 3,
  },
  Mixed_1yr: {
    name: {
      ko: '1년, Mixed',
      en: '1-year, Mixed',
    },
    order: 4,
  },
  EC2_3yr: {
    name: {
      ko: '3년, EC2',
      en: '3-year, EC2',
    },
    order: 5,
  },
  Compute_3yr: {
    name: {
      ko: '3년, Compute',
      en: '3-year, Compute',
    },
    order: 6,
  },
  Mixed_3yr: {
    name: {
      ko: '3년, Mixed',
      en: '3-year, Mixed',
    },
    order: 7,
  },

  // AWS RI
  standard_1yr: {
    name: {
      ko: '1년, Standard',
      en: '1-year, Standard',
    },
    order: 2,
  },
  convertible_1yr: {
    name: {
      ko: '1년, Convertible',
      en: '1-year, Convertible',
    },
    order: 3,
  },
  standard_3yr: {
    name: {
      ko: '3년, Standard',
      en: '3-year, Standard',
    },
    order: 4,
  },
  convertible_3yr: {
    name: {
      ko: '3년, Convertible',
      en: '3-year, Convertible',
    },
    order: 5,
  },

  // Azure RI
  P1Y: {
    name: {
      ko: '1년',
      en: '1-year',
    },
    order: 2,
  },
  P3Y: {
    name: {
      ko: '3년',
      en: '3-year',
    },
    order: 3,
  },
};

// rectProd에 따라서 변수에 들어가있는 값의 필드값이 다름  RDB_HEADER:"" 형식으로 표출
function DETAIL_HEADER(params) {
  const { type, checkObj, rcmdProd, showEnroll, showSubsc } = params;
  const analTypNm = checkObj.analTypNm;
  const rcmdProdNm = rcmdProd.nm;

  let headerName = {};

  if (type === 'SP') {
    headerName = {
      // dataRange: {
      //   field: 'dataRange',
      //   COMPUTE_HEADER: '데이터 분석 기간',
      //   SAGEMAKER_HEADER: '데이터 분석 기간',
      //   order: 1,
      // },
      accId: {
        field: 'accId',
        COMPUTE_HEADER: i18n.locale === 'ko' ? '계정' : 'Account',
        SAGEMAKER_HEADER: i18n.locale === 'ko' ? '계정' : 'Account',
        EC2INSTANCE_HEADER: i18n.locale === 'ko' ? '계정' : 'Account',
        'MIXED(COMPUTE+EC2INSTANCE)_HEADER': i18n.locale === 'ko' ? '계정' : 'Account',
        order: 1,
      },
      spTyp: {
        field: 'spTyp',
        COMPUTE_HEADER: i18n.locale === 'ko' ? '구매 유형' : 'Purchase type',
        EC2INSTANCE_HEADER: i18n.locale === 'ko' ? '구매 유형' : 'Purchase type',
        'MIXED(COMPUTE+EC2INSTANCE)_HEADER': i18n.locale === 'ko' ? '구매 유형' : 'Purchase type',
        SAGEMAKER_HEADER: i18n.locale === 'ko' ? '구매 유형' : 'Purchase type',
        order: 2,
      },
    };

    if (analTypNm === 'EC2' || analTypNm === 'Mixed') {
      headerName = Object.assign({}, headerName, {
        rgnNm: {
          field: 'rgnNm',
          COMPUTE_HEADER: i18n.locale === 'ko' ? '리전' : 'Region',
          // SAGEMAKER_HEADER: '리전',
          EC2INSTANCE_HEADER: i18n.locale === 'ko' ? '리전' : 'Region',
          'MIXED(COMPUTE+EC2INSTANCE)_HEADER': i18n.locale === 'ko' ? '리전' : 'Region',
          order: 3,
        },
        instFmly: {
          field: 'instFmly',
          COMPUTE_HEADER: i18n.locale === 'ko' ? '인스턴스 패밀리' : 'Instance family',
          // SAGEMAKER_HEADER: '인스턴스 패밀리',
          EC2INSTANCE_HEADER: i18n.locale === 'ko' ? '인스턴스 패밀리' : 'Instance family',
          'MIXED(COMPUTE+EC2INSTANCE)_HEADER': i18n.locale === 'ko' ? '인스턴스 패밀리' : 'Instance family',
          order: 4,
        },
      });
    }

    headerName = Object.assign({}, headerName, {
      cmmt: {
        field: 'cmmt',
        COMPUTE_HEADER: i18n.locale === 'ko' ? '시간당 약정 금액' : 'Hourly commitment',
        SAGEMAKER_HEADER: i18n.locale === 'ko' ? '시간당 약정 금액' : 'Hourly commitment',
        EC2INSTANCE_HEADER: i18n.locale === 'ko' ? '시간당 약정 금액' : 'Hourly commitment',
        'MIXED(COMPUTE+EC2INSTANCE)_HEADER': i18n.locale === 'ko' ? '시간당 약정 금액' : 'Hourly commitment',
        order: 5,
      },
      savingsRate: {
        field: 'savingsRate',
        COMPUTE_HEADER: i18n.locale === 'ko' ? '절감률' : 'Savings rate',
        SAGEMAKER_HEADER: i18n.locale === 'ko' ? '절감률' : 'Savings rate',
        EC2INSTANCE_HEADER: i18n.locale === 'ko' ? '절감률' : 'Savings rate',
        'MIXED(COMPUTE+EC2INSTANCE)_HEADER': i18n.locale === 'ko' ? '절감률' : 'Savings rate',
        order: 6,
      },
      mnthOnDmndCost: {
        field: 'mnthOnDmndCost',
        COMPUTE_HEADER: i18n.locale === 'ko' ? '월 온디맨드 비용' : 'Monthly On-Demand cost',
        SAGEMAKER_HEADER: i18n.locale === 'ko' ? '월 온디맨드 비용' : 'Monthly On-Demand cost',
        EC2INSTANCE_HEADER: i18n.locale === 'ko' ? '월 온디맨드 비용' : 'Monthly On-Demand cost',
        'MIXED(COMPUTE+EC2INSTANCE)_HEADER': i18n.locale === 'ko' ? '월 온디맨드 비용' : 'Monthly On-Demand cost',
        order: 7,
      },
      mnthSaveCost: {
        field: 'mnthSaveCost',
        COMPUTE_HEADER: i18n.locale === 'ko' ? '월 예상 절감액' : 'Estimated monthly savings',
        SAGEMAKER_HEADER: i18n.locale === 'ko' ? '월 예상 절감액' : 'Estimated monthly savings',
        EC2INSTANCE_HEADER: i18n.locale === 'ko' ? '월 예상 절감액' : 'Estimated monthly savings',
        'MIXED(COMPUTE+EC2INSTANCE)_HEADER': i18n.locale === 'ko' ? '월 예상 절감액' : 'Estimated monthly savings',
        order: 8,
      },
    });
  }

  if (type === 'RI') {
    //인스턴스 유형
    headerName = {
      accId: {
        field: 'accId',
        EC2_HEADER: i18n.locale === 'ko' ? '계정' : 'Account',
        RDS_HEADER: i18n.locale === 'ko' ? '계정' : 'Account',
        ELASTICACHE_HEADER: i18n.locale === 'ko' ? '계정' : 'Account',
        OPENSEARCH_HEADER: i18n.locale === 'ko' ? '계정' : 'Account',
        REDSHIFT_HEADER: i18n.locale === 'ko' ? '계정' : 'Account',
        order: 1,
      },
      rgnNm: {
        field: 'rgnNm',
        EC2_HEADER: i18n.locale === 'ko' ? '리전' : 'Region',
        RDS_HEADER: i18n.locale === 'ko' ? '리전' : 'Region',
        ELASTICACHE_HEADER: i18n.locale === 'ko' ? '리전' : 'Region',
        OPENSEARCH_HEADER: i18n.locale === 'ko' ? '리전' : 'Region',
        REDSHIFT_HEADER: i18n.locale === 'ko' ? '리전' : 'Region',
        order: 2,
      },
      instTyp: {
        field: 'instTyp',
        EC2_HEADER: i18n.locale === 'ko' ? '인스턴스 유형' : 'Instance type',
        RDS_HEADER: i18n.locale === 'ko' ? '인스턴스 유형' : 'Instance type',
        ELASTICACHE_HEADER: i18n.locale === 'ko' ? '인스턴스 유형' : 'Instance type',
        OPENSEARCH_HEADER: i18n.locale === 'ko' ? '인스턴스 유형' : 'Instance type',
        REDSHIFT_HEADER: i18n.locale === 'ko' ? '인스턴스 유형' : 'Instance type',
        order: 3,
      },
      platform: {
        field: 'platform',
        EC2_HEADER: i18n.locale === 'ko' ? '플랫폼' : 'Platform',
        RDS_HEADER: i18n.locale === 'ko' ? '데이터베이스엔진' : 'Database engine',
        ELASTICACHE_HEADER: i18n.locale === 'ko' ? '캐시엔진' : 'Cache engine',
        order: 4,
      },
    };

    if (rcmdProdNm === 'EC2') {
      headerName = Object.assign({}, headerName, {
        flex: {
          field: 'flex',
          EC2_HEADER: i18n.locale === 'ko' ? '유연성' : 'Flexibility',
          RDS_HEADER: i18n.locale === 'ko' ? '유연성' : 'Flexibility',
          order: 5,
        },
      });
    } else if (rcmdProdNm === 'RDS') {
      headerName = Object.assign({}, headerName, {
        az: { field: 'az', RDS_HEADER: i18n.locale === 'ko' ? 'AZ 배포 옵션' : 'AZ deployment options' },
        flex: {
          field: 'flex',
          EC2_HEADER: i18n.locale === 'ko' ? '유연성' : 'Flexibility',
          RDS_HEADER: i18n.locale === 'ko' ? '유연성' : 'Flexibility',
          order: 6,
        },
      });
    }

    headerName = Object.assign({}, headerName, {
      cmmt: {
        field: 'cmmt',
        EC2_HEADER: i18n.locale === 'ko' ? '구매 추천 수량' : 'Recommended purchase quantity',
        RDS_HEADER: i18n.locale === 'ko' ? '구매 추천 수량' : 'Recommended purchase quantity',
        ELASTICACHE_HEADER: i18n.locale === 'ko' ? '구매 추천 수량' : 'Recommended purchase quantity',
        OPENSEARCH_HEADER: i18n.locale === 'ko' ? '구매 추천 수량' : 'Recommended purchase quantity',
        REDSHIFT_HEADER: i18n.locale === 'ko' ? '구매 추천 수량' : 'Recommended purchase quantity',
        order: 7,
      },
      savingsRate: {
        field: 'savingsRate',
        EC2_HEADER: i18n.locale === 'ko' ? '절감률' : 'Savings rate',
        RDS_HEADER: i18n.locale === 'ko' ? '절감률' : 'Savings rate',
        ELASTICACHE_HEADER: i18n.locale === 'ko' ? '절감률' : 'Savings rate',
        OPENSEARCH_HEADER: i18n.locale === 'ko' ? '절감률' : 'Savings rate',
        REDSHIFT_HEADER: i18n.locale === 'ko' ? '절감률' : 'Savings rate',
        order: 8,
      }, //절감률

      mnthOnDmndCost: {
        field: 'mnthOnDmndCost',
        EC2_HEADER: i18n.locale === 'ko' ? '월 온디맨드 비용' : 'Monthly On-Demand cost',
        RDS_HEADER: i18n.locale === 'ko' ? '월 온디맨드 비용' : 'Monthly On-Demand cost',
        ELASTICACHE_HEADER: i18n.locale === 'ko' ? '월 온디맨드 비용' : 'Monthly On-Demand cost',
        OPENSEARCH_HEADER: i18n.locale === 'ko' ? '월 온디맨드 비용' : 'Monthly On-Demand cost',
        REDSHIFT_HEADER: i18n.locale === 'ko' ? '월 온디맨드 비용' : 'Monthly On-Demand cost',
        order: 9,
      },
      mnthSaveCost: {
        field: 'mnthSaveCost',
        EC2_HEADER: i18n.locale === 'ko' ? '월 예상 절감액' : 'Estimated monthly savings',
        RDS_HEADER: i18n.locale === 'ko' ? '월 예상 절감액' : 'Estimated monthly savings',
        ELASTICACHE_HEADER: i18n.locale === 'ko' ? '월 예상 절감액' : 'Estimated monthly savings',
        OPENSEARCH_HEADER: i18n.locale === 'ko' ? '월 예상 절감액' : 'Estimated monthly savings',
        REDSHIFT_HEADER: i18n.locale === 'ko' ? '월 예상 절감액' : 'Estimated monthly savings',
        order: 10,
      },
    });
  }

  // For Reservation (Azure)
  if (type === 'AzureRI') {
    headerName = Object.assign({}, headerName, {
      sharedAcntOwnrId: {
        field: 'sharedAcntOwnrId',
        headerName: 'Enrollment No.',
        order: 1,
        hide: !showEnroll,
      },
      subscId: {
        field: 'acntId',
        headerName: 'Subscription ID',
        order: 1,
        hide: !showSubsc,
      },
      subscNm: {
        field: 'acntNm',
        headerName: 'Subscription',
        order: 2,
        hide: !showSubsc,
      },
      rgnNm: {
        field: 'rgnNm',
        headerName: i18n.locale === 'ko' ? '리전' : 'Region',
        order: 3,
      },
      instNm: {
        field: 'instNm',
        headerName: i18n.locale === 'ko' ? '이름' : 'Name',
        order: 4,
      },
    });
    if (rcmdProdNm === 'VM') {
      headerName = Object.assign({}, headerName, {
        instFlexGrp: {
          field: 'instFlexGrp',
          headerName: i18n.locale === 'ko' ? '인스턴스 유연성 그룹' : 'Instance flexibility group',
          order: 5,
        },
      });
    }
    headerName = Object.assign({}, headerName, {
      cmmt: {
        field: 'cmmt',
        headerName: i18n.locale === 'ko' ? '구매 추천 수량' : 'Recommended purchase quantity',
        order: 6,
      },
      savingsRate: {
        field: 'savingsRate',
        headerName: i18n.locale === 'ko' ? '절감률' : 'Savings rate',
        order: 7,
      }, //절감률

      mnthOnDmndCost: {
        field: 'mnthOnDmndCost',
        headerName: i18n.locale === 'ko' ? '월 종량제 비용' : 'Monthly PAYG fee',
        order: 8,
      },
      mnthSaveCost: {
        field: 'mnthExpctCmmtSaveCost',
        headerName: i18n.locale === 'ko' ? '월 예상 절감액' : 'Estimated monthly savings',
        order: 9,
      },
      // cmmtUnitCnt: {
      //   field: 'cmmtUnitCnt',
      //   headerName: '약정 단위 개수',
      //   order: 10,
      // },
      // mnthExpctCmmtCost: {
      //   field: 'mnthExpctCmmtCost',
      //   headerName: '월 예상 약정 비용',
      //   order: 11,
      // },
      // mnthExpctCmmtSaveCost: {
      //   field: 'mnthExpctCmmtSaveCost',
      //   headerName: '월 예상약정 절감 비용',
      //   order: 12,
      // },
      // mnthExpctRsdlOnDmndCost: {
      //   field: 'mnthExpctRsdlOnDmndCost',
      //   headerName: '월 예상 잔여 종량제 비용',
      //   order: 13,
      // },
      // mnthExpctTotCost: {
      //   field: 'mnthExpctTotCost',
      //   headerName: '월 예상 총비용',
      //   order: 14,
      // },
    });
  }

  return headerName;
}

const yearToString = {
  '1yr': {
    ko: '1년',
    en: '1-year',
  },
  '3yr': {
    ko: '3년',
    en: '3-year',
  },
  P1Y: {
    ko: '1년',
    en: '1-year',
  },
  P3Y: {
    ko: '3년',
    en: '3-year',
  },
};

const prePaymentToString = {
  'No Upfront': {
    ko: '선결제 없음',
    en: 'No upfront',
  },
  'Partial Upfront': {
    ko: '부분 선결제',
    en: 'Partial upfront',
  },
  'All Upfront': {
    ko: '전체 선결제',
    en: 'All upfront',
  },
};
const scopeToString = {
  Shared: {
    ko: '공유',
    en: 'Shared',
  },
  Single: {
    ko: '단일 구독',
    en: 'Single subscription',
  },
};

export { TYPE, DETAIL_HEADER, yearToString, prePaymentToString, scopeToString };
