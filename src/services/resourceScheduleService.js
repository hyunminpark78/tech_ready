import APICaller from '@/library/APICaller';

function fetchSpotTotalUsage(param) {
  return APICaller.post(`/cap/v1/total-usage/spot`, param);
}

function fetchMonthlySavingData(param) {
  return APICaller.post(`/cap/v1/recommendation/saving`, param);
}

function fetchOnDemandUsage(param) {
  return APICaller.post('/cap/v1/recommendation/spot', param);
}

function fetchTagsByAccountId(param) {
  return APICaller.post(`/cap/v1/tag/by-account`, param);
}

// TODO : 임시 데이터 (추후 api 생성 시 삭제 필요)
function getData() {
  return [
    { acntId: 'DeepBrainAI-Prod (433474878361)', rsrcId: 'i-051a2a3bc3f789557', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 'g4dn.4xlarge', instsFamNm: 'g4dn', instsFamGrpCd: 'GPU instance', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Schedule", "value": "None"}, {"key": "Name", "value": "ec2-apne2-prod-saas-unity-china"}, {"key": "Environment", "value": "Production"}, {"key": "Owner", "value": "Nick"}, {"key": "Service", "value": "DBAI-Seoul"}, {"key": "datadog", "value": "true"}, {"key": "Expire", "value": "None"}, {"key": "Terraform", "value": "true"}], recmSchdDateNm: 'Everyday', recmSchdTimeNm: 'Night', curSchdDateNm: 'Everyday', curSchdTimeNm: '20:00~10:00', instsUsageQty: 672, expctInstsUsageQty: 420, mnthUseAmt: 2085754, mnthExpctUseAmt: 1303596, mnthExpctSaveAmt: 849665, mnthExpctSaveRate: 37.5, expctOprtnRate: 62.5,  },
    { acntId: 'DeepBrainAI-Stg (455713709059)', rsrcId: 'i-0c3222b95f483abfd', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 'm7i.2xlarge', instsFamNm: 'm7i', instsFamGrpCd: 'General Purpose', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Owner", "value": "Steven"}, {"key": "Schedule", "value": "all-days"}, {"key": "Name", "value": "ec2-apne2-stg-ai-production"}, {"key": "Service", "value": "Management"}, {"key": "Environment", "value": "Staging"}, {"key": "Expire", "value": "None"}, {"key": "Terraform", "value": "true"}], recmSchdDateNm: 'Weekday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '07:00~18:00', instsUsageQty: 672, expctInstsUsageQty: 336, mnthUseAmt: 466260, mnthExpctUseAmt: 233130, mnthExpctSaveAmt: 253252, mnthExpctSaveRate: 50, expctOprtnRate: 50,  },
    { acntId: 'DeepBrainAI-RnD (365997243776)', rsrcId: 'i-0b234365e5da3bd64', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 'g4ad.xlarge', instsFamNm: 'g4ad', instsFamGrpCd: 'GPU instance', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Name", "value": "ec2-apne2-rnd-triton-eks"}], recmSchdDateNm: 'Everyday', recmSchdTimeNm: 'Night', curSchdDateNm: 'Everyday', curSchdTimeNm: '21:00~05:00', instsUsageQty: 672, expctInstsUsageQty: 480, mnthUseAmt: 608698, mnthExpctUseAmt: 434784, mnthExpctSaveAmt: 188924, mnthExpctSaveRate: 28.57, expctOprtnRate: 71.43,  },
    { acntId: 'DeepBrainAI-RnD (365997243776)', rsrcId: 'i-0c100d610bd5d672b', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 'g5.xlarge', instsFamNm: 'g5', instsFamGrpCd: 'GPU instance', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Name", "value": "ec2-apne2-rnd-vcdemo"}], recmSchdDateNm: 'Weekday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '07:00~21:00', instsUsageQty: 672, expctInstsUsageQty: 552, mnthUseAmt: 608698, mnthExpctUseAmt: 500002, mnthExpctSaveAmt: 118078, mnthExpctSaveRate: 17.86, expctOprtnRate: 82.14,  },
    { acntId: 'DeepBrainAI-RnD (365997243776)', rsrcId: 'i-053acec1b65e9a0b2', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 'g5.xlarge', instsFamNm: 'g5', instsFamGrpCd: 'GPU instance', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Name", "value": "ec2-apne2-rnd-vcdemo"}], recmSchdDateNm: 'Weekday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '07:00~21:00', instsUsageQty: 672, expctInstsUsageQty: 552, mnthUseAmt: 608698, mnthExpctUseAmt: 500002, mnthExpctSaveAmt: 118078, mnthExpctSaveRate: 17.86, expctOprtnRate: 82.14,  },
    { acntId: 'Seyoung Eric Jang (778465123442)', rsrcId: 'i-02efebb2acd137c0f', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 'g5.xlarge', instsFamNm: 'g5', instsFamGrpCd: 'GPU instance', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Expire", "value": "None"}, {"key": "datadog", "value": ""}, {"key": "Agent", "value": ""}, {"key": "final_todo", "value": "유지"}, {"key": "Environment", "value": "Production"}, {"key": "Backup", "value": ""}, {"key": "Name", "value": "ec2-ap-northeast2-prod-speaknow-redirect"}, {"key": "Project", "value": "speaknow"}, {"key": "Service", "value": "Speaknow"}, {"key": "memo", "value": "speaknow"}, {"key": "Owner", "value": "Liam"}, {"key": "deepbrain:oldname", "value": "speaknow.ai redirect (production)"}], recmSchdDateNm: 'Weekday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '10:00~15:00', instsUsageQty: 672, expctInstsUsageQty: 516, mnthUseAmt: 420000, mnthExpctUseAmt: 322560, mnthExpctSaveAmt: 105850, mnthExpctSaveRate: 23.2, expctOprtnRate: 85.71,  },
    { acntId: 'DeepBrainAI-Shared (890843764628)', rsrcId: 'i-06ba3723333d3e67d', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 'g4ad.xlarge', instsFamNm: 'g4ad', instsFamGrpCd: 'GPU instance', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Expire", "value": "None"}, {"key": "Owner", "value": "Davis"}, {"key": "Service", "value": "Management"}, {"key": "Environment", "value": "Shared"}, {"key": "Terraform", "value": "true"}, {"key": "Name", "value": "ec2-apne2-shared-k8s-svr"}], recmSchdDateNm: 'Weekday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '11:00~19:00', instsUsageQty: 672, expctInstsUsageQty: 530, mnthUseAmt: 420000, mnthExpctUseAmt: 331520, mnthExpctSaveAmt: 96117, mnthExpctSaveRate: 21.07, expctOprtnRate: 88.1,  },
    { acntId: 'DeepBrainAI-RnD (365997243776)', rsrcId: 'i-02f293335d76be2e9', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 't2.micro', instsFamNm: 't2', instsFamGrpCd: 'General Purpose', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Name", "value": "ec2-apne2-rnd-vcdemo"}], recmSchdDateNm: 'Weekday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '07:00~21:00', instsUsageQty: 672, expctInstsUsageQty: 530, mnthUseAmt: 392000, mnthExpctUseAmt: 309120, mnthExpctSaveAmt: 90033, mnthExpctSaveRate: 21.14, expctOprtnRate: 82.14,  },
    { acntId: 'DeepBrainAI-RnD (365997243776)', rsrcId: 'i-0c21eef822660bfab', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 't3.medium', instsFamNm: 't3', instsFamGrpCd: 'General Purpose', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Name", "value": "ec2-apne2-rnd-triton-eks"}], recmSchdDateNm: 'Everyday', recmSchdTimeNm: 'Night', curSchdDateNm: 'Everyday', curSchdTimeNm: '21:00~05:00', instsUsageQty: 672, expctInstsUsageQty: 516, mnthUseAmt: 350000, mnthExpctUseAmt: 268800, mnthExpctSaveAmt: 88208, mnthExpctSaveRate: 23.2, expctOprtnRate: 71.43,  },
    { acntId: 'DeepBrainAI-RnD (365997243776)', rsrcId: 'i-0423eabb884050a94', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 'g4ad.xlarge', instsFamNm: 'g4ad', instsFamGrpCd: 'GPU instance', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Name", "value": "ec2-apne2-rnd-triton-eks"}], recmSchdDateNm: 'Everyday', recmSchdTimeNm: 'Night', curSchdDateNm: 'Everyday', curSchdTimeNm: '21:00~05:00', instsUsageQty: 672, expctInstsUsageQty: 554, mnthUseAmt: 448000, mnthExpctUseAmt: 369600, mnthExpctSaveAmt: 85167, mnthExpctSaveRate: 17.5, expctOprtnRate: 71.43,  },
    { acntId: 'DeepBrainAI-Prod (433474878361)', rsrcId: 'i-083496068255e056c', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 'g4dn.xlarge', instsFamNm: 'g4dn', instsFamGrpCd: 'GPU instance', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Schedule", "value": "None"}, {"key": "Name", "value": "ec2-apne2-prod-saas-unity-china"}, {"key": "Environment", "value": "Production"}, {"key": "Owner", "value": "Nick"}, {"key": "Service", "value": "DBAI-Seoul"}, {"key": "datadog", "value": "true"}, {"key": "Expire", "value": "None"}, {"key": "Terraform", "value": "true"}], recmSchdDateNm: 'Everyday', recmSchdTimeNm: 'Night', curSchdDateNm: 'Everyday', curSchdTimeNm: '20:00~10:00', instsUsageQty: 672, expctInstsUsageQty: 513, mnthUseAmt: 308000, mnthExpctUseAmt: 235200, mnthExpctSaveAmt: 79083, mnthExpctSaveRate: 23.64, expctOprtnRate: 62.5,  },
    { acntId: 'DeepBrainAI-Prod (433474878361)', rsrcId: 'i-00b4c7881d2746941', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 't3.medium', instsFamNm: 't3', instsFamGrpCd: 'General Purpose', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Schedule", "value": "None"}, {"key": "Name", "value": "ec2-apne2-prod-saas-unity-china"}, {"key": "Environment", "value": "Production"}, {"key": "Owner", "value": "Nick"}, {"key": "Service", "value": "DBAI-Seoul"}, {"key": "datadog", "value": "true"}, {"key": "Expire", "value": "None"}, {"key": "Terraform", "value": "true"}], recmSchdDateNm: 'Everyday', recmSchdTimeNm: 'Night', curSchdDateNm: 'Everyday', curSchdTimeNm: '20:00~10:00', instsUsageQty: 672, expctInstsUsageQty: 513, mnthUseAmt: 308000, mnthExpctUseAmt: 235200, mnthExpctSaveAmt: 79083, mnthExpctSaveRate: 23.64, expctOprtnRate: 62.5,  },
    { acntId: 'DeepBrainAI-Stg (455713709059)', rsrcId: 'i-02fdd8f6fafa9f163', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 't3.large', instsFamNm: 't3', instsFamGrpCd: 'General Purpose', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Owner", "value": "Steven"}, {"key": "Schedule", "value": "all-days"}, {"key": "Name", "value": "ec2-apne2-stg-ai-production"}, {"key": "Service", "value": "Management"}, {"key": "Environment", "value": "Staging"}, {"key": "Expire", "value": "None"}, {"key": "Terraform", "value": "true"}], recmSchdDateNm: 'Weekday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '07:00~18:00', instsUsageQty: 672, expctInstsUsageQty: 531, mnthUseAmt: 238000, mnthExpctUseAmt: 188160, mnthExpctSaveAmt: 54142, mnthExpctSaveRate: 20.94, expctOprtnRate: 50,  },
    { acntId: 'DeepBrainAI-Stg (455713709059)', rsrcId: 'i-0eb683005b411b10b', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 'm7i.2xlarge', instsFamNm: 'm7i', instsFamGrpCd: 'General Purpose', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Owner", "value": "Steven"}, {"key": "Schedule", "value": "all-days"}, {"key": "Name", "value": "ec2-apne2-stg-ai-production"}, {"key": "Service", "value": "Management"}, {"key": "Environment", "value": "Staging"}, {"key": "Expire", "value": "None"}, {"key": "Terraform", "value": "true"}], recmSchdDateNm: 'Weekday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '07:00~18:00', instsUsageQty: 672, expctInstsUsageQty: 560, mnthUseAmt: 280000, mnthExpctUseAmt: 233130, mnthExpctSaveAmt: 50915, mnthExpctSaveRate: 16.74, expctOprtnRate: 50,  },
    { acntId: 'DeepBrainAI-Stg (455713709059)', rsrcId: 'i-0a6f96f3d256c1044', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 't3.medium', instsFamNm: 't3', instsFamGrpCd: 'General Purpose', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Service", "value": "KBbank"}, {"key": "Name", "value": "ec2-b2b-kbbank-k8s"}, {"key": "Environment", "value": "B2B"}, {"key": "Schedule", "value": "None"}, {"key": "InstanceScheduler-LastAction", "value": "Started By instance-scheduler-hub 2024/05/31 00:00UTC"}, {"key": "Owner", "value": "James"}, {"key": "Expire", "value": "None"}, {"key": "Terraform", "value": "true"}], recmSchdDateNm: 'Everyday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '09:00~14:00', instsUsageQty: 668, expctInstsUsageQty: 168, mnthUseAmt: 48644, mnthExpctUseAmt: 12230, mnthExpctSaveAmt: 39556, mnthExpctSaveRate: 74.86, expctOprtnRate: 25,  },
    { acntId: 'DeepBrainAI-Stg (455713709059)', rsrcId: 'i-01e6d9c94c2950e66', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 'g4dn.4xlarge', instsFamNm: 'g4dn', instsFamGrpCd: 'GPU instance', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Service", "value": "KBbank"}, {"key": "Name", "value": "ec2-b2b-kbbank-k8s"}, {"key": "Environment", "value": "B2B"}, {"key": "Schedule", "value": "None"}, {"key": "InstanceScheduler-LastAction", "value": "Started By instance-scheduler-hub 2024/05/31 00:00UTC"}, {"key": "Owner", "value": "James"}, {"key": "Expire", "value": "None"}, {"key": "Terraform", "value": "true"}], recmSchdDateNm: 'Everyday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '09:00~14:00', instsUsageQty: 668, expctInstsUsageQty: 561, mnthUseAmt: 140000, mnthExpctUseAmt: 117600, mnthExpctSaveAmt: 24333, mnthExpctSaveRate: 16, expctOprtnRate: 25,  },
    { acntId: 'DeepBrainAI-Shared (890843764628)', rsrcId: 'i-0edbf8533f3e5eae4', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 't3.medium', instsFamNm: 't3', instsFamGrpCd: 'General Purpose', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "datadog_csm", "value": "true"}, {"key": "Owner", "value": "Davis"}, {"key": "Name", "value": "ec2-apne2-shared-bastion"}, {"key": "Service", "value": "Management"}, {"key": "Environment", "value": "Shared"}, {"key": "Expire", "value": "None"}, {"key": "Terraform", "value": "true"}], recmSchdDateNm: 'Weekday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '10:00~19:00', instsUsageQty: 670, expctInstsUsageQty: 589, mnthUseAmt: 98000, mnthExpctUseAmt: 86195, mnthExpctSaveAmt: 12824, mnthExpctSaveRate: 12.05, expctOprtnRate: 88.1,  },
    { acntId: 'DeepBrainAI-Shared (890843764628)', rsrcId: 'i-007394065aa960025', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 't3.large', instsFamNm: 't3', instsFamGrpCd: 'General Purpose', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "datadog_csm", "value": "true"}, {"key": "Owner", "value": "Davis"}, {"key": "Name", "value": "ec2-apne2-shared-bastion"}, {"key": "Service", "value": "Management"}, {"key": "Environment", "value": "Shared"}, {"key": "Expire", "value": "None"}, {"key": "Terraform", "value": "true"}], recmSchdDateNm: 'Weekday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '10:00~19:00', instsUsageQty: 670, expctInstsUsageQty: 592, mnthUseAmt: 97552, mnthExpctUseAmt: 86195, mnthExpctSaveAmt: 12337, mnthExpctSaveRate: 11.64, expctOprtnRate: 88.1,  },
    { acntId: 'DeepBrainAI-Shared (890843764628)', rsrcId: 'i-0cac528a8e526b3ad', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 'm7i.2xlarge', instsFamNm: 'm7i', instsFamGrpCd: 'General Purpose', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "datadog_csm", "value": "true"}, {"key": "Owner", "value": "Davis"}, {"key": "Name", "value": "ec2-apne2-shared-bastion"}, {"key": "Service", "value": "Management"}, {"key": "Environment", "value": "Shared"}, {"key": "Expire", "value": "None"}, {"key": "Terraform", "value": "true"}], recmSchdDateNm: 'Weekday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '10:00~19:00', instsUsageQty: 670, expctInstsUsageQty: 592, mnthUseAmt: 97552, mnthExpctUseAmt: 86195, mnthExpctSaveAmt: 12337, mnthExpctSaveRate: 11.64, expctOprtnRate: 88.1,  },
    { acntId: 'DeepBrainAI-Shared (890843764628)', rsrcId: 'i-0de70a2c072295860', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 't3.medium', instsFamNm: 't3', instsFamGrpCd: 'General Purpose', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Expire", "value": "None"}, {"key": "Owner", "value": "Davis"}, {"key": "Service", "value": "Management"}, {"key": "Environment", "value": "Shared"}, {"key": "Terraform", "value": "true"}, {"key": "Name", "value": "ec2-apne2-shared-k8s-svr"}], recmSchdDateNm: 'Weekday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '11:00~19:00', instsUsageQty: 672, expctInstsUsageQty: 592, mnthUseAmt: 48922, mnthExpctUseAmt: 43098, mnthExpctSaveAmt: 6327, mnthExpctSaveRate: 11.9, expctOprtnRate: 88.1,  },
    { acntId: 'DeepBrainAI-Shared (890843764628)', rsrcId: 'i-0bfc81db6d8bb952c', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 't3.medium', instsFamNm: 't3', instsFamGrpCd: 'General Purpose', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Expire", "value": "None"}, {"key": "Owner", "value": "Davis"}, {"key": "Service", "value": "Management"}, {"key": "Environment", "value": "Shared"}, {"key": "Terraform", "value": "true"}, {"key": "Name", "value": "ec2-apne2-shared-k8s-svr"}], recmSchdDateNm: 'Weekday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '11:00~19:00', instsUsageQty: 672, expctInstsUsageQty: 592, mnthUseAmt: 48922, mnthExpctUseAmt: 43098, mnthExpctSaveAmt: 6327, mnthExpctSaveRate: 11.9, expctOprtnRate: 88.1,  },
    { acntId: 'DeepBrainAI-RnD (365997243776)', rsrcId: 'i-05a00f921d089a089', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 't2.micro', instsFamNm: 't2', instsFamGrpCd: 'General Purpose', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Name", "value": "ec2-apne2-rnd-bastion_proxy"}], recmSchdDateNm: 'Weekday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '10:00~19:00', instsUsageQty: 672, expctInstsUsageQty: 534, mnthUseAmt: 13548, mnthExpctUseAmt: 10774, mnthExpctSaveAmt: 3012, mnthExpctSaveRate: 20.47, expctOprtnRate: 183.3,  },
    { acntId: 'Seyoung Eric Jang (778465123442)', rsrcId: 'i-06a56718bc6585b34', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 't2.micro', instsFamNm: 't2', instsFamGrpCd: 'General Purpose', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Expire", "value": "None"}, {"key": "datadog", "value": ""}, {"key": "Agent", "value": ""}, {"key": "final_todo", "value": "유지"}, {"key": "Environment", "value": "Production"}, {"key": "Backup", "value": ""}, {"key": "Name", "value": "ec2-ap-northeast2-prod-speaknow-redirect"}, {"key": "Project", "value": "speaknow"}, {"key": "Service", "value": "Speaknow"}, {"key": "memo", "value": "speaknow"}, {"key": "Owner", "value": "Liam"}, {"key": "deepbrain:oldname", "value": "speaknow.ai redirect (production)"}], recmSchdDateNm: 'Weekday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '10:00~15:00', instsUsageQty: 672, expctInstsUsageQty: 576, mnthUseAmt: 13548, mnthExpctUseAmt: 11612, mnthExpctSaveAmt: 2102, mnthExpctSaveRate: 14.29, expctOprtnRate: 85.71,  },
    { acntId: 'DeepBrainAI-Stg (455713709059)', rsrcId: 'i-0640eaf60534c2afa', cspPrdtCd: 'AmazonEC2', cspPrdtNm: 'EC2', instsTypNm: 't2.micro', instsFamNm: 't2', instsFamGrpCd: 'General Purpose', regionSepCd: 'ap-northeast-2', regionSepNm: 'Asia Pacific (Seoul)', tag: [{"key": "Service", "value": "KBbank"}, {"key": "Name", "value": "ec2-b2b-kbbank-k8s"}, {"key": "Environment", "value": "B2B"}, {"key": "Schedule", "value": "None"}, {"key": "InstanceScheduler-LastAction", "value": "Started By instance-scheduler-hub 2024/05/31 00:00UTC"}, {"key": "Owner", "value": "James"}, {"key": "Expire", "value": "None"}, {"key": "Terraform", "value": "true"}], recmSchdDateNm: 'Everyday', recmSchdTimeNm: 'Day', curSchdDateNm: 'Everyday', curSchdTimeNm: '09:00~14:00', instsUsageQty: 668, expctInstsUsageQty: 584, mnthUseAmt: 14000, mnthExpctUseAmt: 12230, mnthExpctSaveAmt: 1922, mnthExpctSaveRate: 12.64, expctOprtnRate: 25,  },
  ];
}

function getFilteredData(param, data) {
  return data
    .filter((data) => {
      if (param.regions && param.regions.length > 0) {
        return param.regions.includes(data.regionSepCd);
      }
      return true;
    })
    .filter((data) => {
      if (param.regions && param.regions.length > 0) {
        return param.regions.includes(data.regionSepCd);
      }
      return true;
    })
    .filter((data) => {
      if (param.services && param.services.length > 0) {
        return param.services.includes(data.cspPrdtNm);
      }
      return true;
    })
    .filter((data) => {
      if (param.recommendSchedules && param.recommendSchedules.length > 0) {
        return param.recommendSchedules.includes(data.recmSchdDateNm + ' ' + data.recmSchdTimeNm);
      }
      return true;
    });
}

function fetchSchedulingRecommendDetail(param) {
  let response = {
    data: getFilteredData(
      param,
      getData()
    ),
  };
  return new Promise((resolve) => setTimeout(() => resolve(response), 500));
}

function fetchSchedulingRecommendGPUDetail(param) {
  let response = {
    data: getFilteredData(
      param,
      getData().filter((data) => data.instsFamGrpCd === 'GPU instance')
    ),
  };
  return new Promise((resolve) => setTimeout(() => resolve(response), 500));
}

export default {
  fetchSpotTotalUsage,
  fetchMonthlySavingData,
  fetchOnDemandUsage,
  fetchTagsByAccountId,
  fetchSchedulingRecommendDetail,
  fetchSchedulingRecommendGPUDetail,
};
