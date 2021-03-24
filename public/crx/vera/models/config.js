const videoStreamConfig = {
  video: {
    facingMode: 'user',
    width: { min: 200, ideal: 200, max: 720 },
    height: { min: 200, ideal: 200, max: 720 }
  },
  audio: false
};
const audioStreamConfig = {
  video: false,
  audio: true
};
const fullStreamConfig = {
  video: {
    facingMode: 'user',
    width: { min: 200, ideal: 200, max: 720 },
    height: { min: 200, ideal: 200, max: 720 }
  },
  audio: true
};
const peerConfig = {
  host: 'r.nicegoodthings.com',
  // port: '80',
  path: '/ngt'
  // config: { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] }
  // debug: 3
};
const userKey = 'portal-vera-host-user';
const peerKey = 'portal-vera-id';
const installCheckKey = 'ext-portal';
// const ExtFlag = 'portal-ext';
export {
  installCheckKey,
  userKey,
  peerKey,
  peerConfig,
  audioStreamConfig,
  videoStreamConfig,
  fullStreamConfig
};
