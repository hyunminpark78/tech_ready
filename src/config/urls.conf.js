/**
 * Created by sungho.hong on 2019-04-19.
 */
export default {
  profile: '',
  session_timestamp_key: '',
  clientId: 'cloud-radar-sso',
  init: function (profile) {
    this.profile = profile;
    switch (profile) {
      case 'prd':
        this.session_timestamp_key = 'session_timestamp';
        break;
      case 'stg':
        this.session_timestamp_key = 'session_timestamp_stg';
        break;
      case 'dev':
        this.session_timestamp_key = 'session_timestamp_dev';
        break;
      case 'local':
        this.session_timestamp_key = 'session_timestamp_local';
        break;
    }
  },
};
