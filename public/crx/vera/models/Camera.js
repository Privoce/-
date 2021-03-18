import { localStreamConfig, remoteStreamConfig } from './config.js';
import { bgRemove, bgRestore, copyToClipboard, selectText } from './utils.js';
const handleControl = async (control, btn, root) => {
  let videoEle = btn.parentElement.nextElementSibling;
  let videoContainer = videoEle.parentElement;
  let isTrue;
  let map = {
    audio: {
      on: 'AUDIO_ON',
      off: 'AUDIO_OFF'
    },
    video: {
      on: 'VIDEO_ON',
      off: 'VIDEO_OFF'
    }
  };
  if (['pin', 'audio', 'video'].includes(control)) {
    isTrue = videoContainer.getAttribute(control) == 'true';
    if (isTrue) {
      videoContainer.removeAttribute(control);
    } else {
      videoContainer.setAttribute(control, true);
    }
  }
  if (control == 'pin') {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    }
    videoEle.requestPictureInPicture().catch((error) => {
      // Error handling
      console.log('pip error', error);
    });
  }
  if (control == 'audio' || control == 'video') {
    let tracks =
      control == 'audio'
        ? videoEle.srcObject.getAudioTracks()
        : videoEle.srcObject.getVideoTracks();
    tracks.forEach((t) => {
      console.log({ t });
      t.enabled = !t.enabled;
    });

    if (root.classList.contains('host')) {
      window.PEER_DATA_CONN?.send({ type: isTrue ? map[control].on : map[control].off });
    }
  }
  if (control == 'bg') {
    let bgRemoved = videoContainer.getAttribute('bg') == 'true';
    let bgRemoving = videoContainer.getAttribute('bg-removing') == 'true';
    if (bgRemoving) return;
    if (bgRemoved) {
      videoContainer.removeAttribute('bg');
      bgRestore(root);
    } else {
      videoContainer.setAttribute('bg-removing', true);
      await bgRemove(root);
      videoContainer.removeAttribute('bg-removing');
      videoContainer.setAttribute('bg', true);
    }
  }
};
class Camera {
  constructor({ host = false, inviteId = null, localId = null }) {
    this.dom = document.createElement('div');
    this.dom.classList.add('camera');
    this.dom.innerHTML = `
    <div class='processing'>processing</div>
    <div class='video'>
      <div class='opts'>
        <button class='opt bg' control='bg' title='clear background'></button>
        <button class='opt video' control='video' title='video'></button>
        <button class='opt audio' control='audio' title='audio'></button>
        <button class='opt pin' control='pin' title='pin'></button>
      </div>
      <video playsinline autoplay ></video>
      <canvas class='render' width=200 height=200 ></canvas>
      <canvas class='side' width=200 height=200 ></canvas>
      <div class='mask user'></div>
      <div class='mask error'>Camera Error</div>
    </div>
    `;
    this.initControls();
    if (host) {
      this.initHostCamera();
    } else {
      this.initRemoteCamera({ inviteId, localId });
    }

    return this.dom;
  }
  initControls() {
    let controls = [...this.dom.querySelectorAll('.opts .opt')].map((opt) =>
      opt.getAttribute('control')
    );
    this.dom.addEventListener(
      'click',
      ({ target }) => {
        console.log('click remote', { target });
        let control = target.getAttribute('control');
        if (controls.includes(control)) {
          handleControl(control, target, this.dom);
        }
      },
      true
    );
  }
  async initHostCamera() {
    this.dom.classList.add('host');
    //  贴上本地视频
    try {
      let videoDom = this.dom.querySelector('video');
      let stream = await navigator.mediaDevices.getUserMedia(localStreamConfig);
      VERA_STREAMS.push(stream);
      videoDom.srcObject = stream;
    } catch (error) {
      console.error('getUserMedia error', error);
      this.dom.setAttribute('camera-status', 'allow-error');
    }
    // incoming voice/video connection
    window.MyPeer.on('call', async (call) => {
      console.log('called from remote');
      try {
        let stream = await navigator.mediaDevices.getUserMedia(remoteStreamConfig);
        VERA_STREAMS.push(stream);
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', (s) => {
          VERA_STREAMS.push(s);
          let remoteVideoContainer = this.dom.nextElementSibling;
          let videoEle = remoteVideoContainer.querySelector('video');
          console.log('attach stream', videoEle);
          videoEle.srcObject = s;
          remoteVideoContainer.setAttribute('camera-status', 'connected');
          this.dom.setAttribute('camera-status', 'connected');
        });
        call.on('close', () => {
          console.log('call close');
        });
      } catch (error) {
        console.error('Failed to get local stream', error);
      }
    });
  }
  initRemoteCamera({ inviteId, localId }) {
    console.log('detected inviteId', inviteId);
    let prevHtml = this.dom.innerHTML;
    console.log('copy link');
    let obj = new URL(location.href);
    obj.searchParams.append('portal-vera-id', localId);
    console.log(obj.href);
    let inviteUrl = `https://nicegoodthings.com/transfer/${encodeURIComponent(obj.href)}`;
    this.dom.innerHTML = `${prevHtml}
    ${
      inviteId
        ? `<div class="invite">
        <button class='btn join'>Join</button>
        </div>
        `
        : `<div class="invite">
          <button class="btn copy">Copy Invite Link</button>
          <div class='link' contenteditable>${inviteUrl}</div>
        </div>`
    }`;
    this.dom.classList.add('remote');

    if (!inviteId) {
      // 邀请按钮的点击事件
      let inviteBtn = this.dom.querySelector('.btn.copy');
      let linkBox = this.dom.querySelector('.invite .link');
      linkBox.addEventListener('click', (evt) => {
        selectText(evt.target);
      });
      inviteBtn.addEventListener('click', () => {
        copyToClipboard(inviteUrl);
      });
    } else {
      // 响应加入按钮的事件
      let joinBtn = this.dom.querySelector('.btn.join');
      joinBtn.addEventListener('click', async () => {
        // create audio and video constraints
        try {
          let stream = await navigator.mediaDevices.getUserMedia(remoteStreamConfig);
          VERA_STREAMS.push(stream);
          console.log('join event peer called');
          let call = window.MyPeer.call(inviteId, stream);
          call.on('stream', (st) => {
            VERA_STREAMS.push(st);
            let remoteVideo = this.dom.querySelector('video');
            remoteVideo.srcObject = st;
            this.dom.setAttribute('camera-status', 'connected');
            this.dom.previousElementSibling.setAttribute('camera-status', 'connected');
            // console.log('connect from remote camrea', inviteId);
            // window.MyPeer.connect(inviteId);
          });
          call.on('close', () => {
            console.log('call close');
          });
        } catch (error) {
          this.dom.setAttribute('camera-status', 'allow-error');
          console.log('join event peer called,error');
          console.error('Failed to get local stream', error);
        }
      });
    }
  }
}
export default Camera;
