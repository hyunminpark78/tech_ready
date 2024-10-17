import APICaller from '@/library/APICaller';

function downloadFile({ filename }) {
  return APICaller.get('/cap/v1/ocp/support/file', { filename }, { responseType: 'blob' });
}

export { downloadFile };
