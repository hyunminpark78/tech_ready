import Setting from './Setting.vue';

export default Setting;

import { SvcGrpMgmt } from './SvcGrpMgmt';
import { CloudAuthMgmt } from './CloudAuth';
import { AwsAcctCreate, AwsAcctDelete } from './CloudAuth/AwsAcctMgmt';
import { AzureAcctCreate, AzureAcctUpdate, AzureAcctDelete } from './CloudAuth/AzureAcctMgmt';
import { Notification } from './Notification';

export {
  SvcGrpMgmt,
  CloudAuthMgmt,
  AwsAcctCreate,
  AwsAcctDelete,
  AzureAcctCreate,
  AzureAcctUpdate,
  AzureAcctDelete,
  Notification,
};
