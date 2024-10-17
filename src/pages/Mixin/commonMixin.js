import _ from 'loadsh';

export default {
  methods: {
    getCspTypCd(cmmtTyp) {
      switch (cmmtTyp) {
        case 'SP':
        case 'RI':
          return 'AWS';
        case 'AzureRI':
          return 'AZURE';
        case 'GcpRI':
          return 'GCP';
        default:
          return 'AWS';
      }
    },
    getCmmtList(cspTypCd) {
      switch (cspTypCd) {
        case 'AWS':
          return ['SP', 'RI'];
        case 'AZURE':
          return ['AzureRI'];
        case 'GCP':
          return ['GcpRI'];
        default:
          return ['SP', 'RI']; // default is AWS
      }
    },
    moveToFirst(list, expr, useDeepClone = false) {
      const items = useDeepClone ? _.cloneDeep(list) : list;
      const targetIndex = items.findIndex(expr);
      if (targetIndex > 0) {
        const target = items[targetIndex];
        items.splice(targetIndex, 1);
        items.unshift(target);
      }
      return items;
    },
  },
};
