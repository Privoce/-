import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import styled, { keyframes } from 'styled-components';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

import IconPC from '../../asset/img/icon.pc.png';
import IconMobile from '../../asset/img/icon.mobile.png';
import IconFS from '../../asset/img/icon.full-screen.png';
import IconOpen from '../../asset/img/icon.open.png';
import { getDefaultIcon } from '../../util';

const modalRoot = document.querySelector('#modal-root');

const AniFadeIn = keyframes`
from{
  opacity:0.1;
}
to{
  opacity:1;
}
`;
const StyledWrapper = styled.section`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 998;
  .modal {
    position: relative;
    border-radius: 0.04rem;
    padding: 0.08rem;
    min-height: 60vh;
    min-width: 375px;
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    overflow: scroll;
    border: 1px solid rgba(22, 22, 22, 0.6);
    resize: horizontal;
    background: #fff;
    animation: ${AniFadeIn} 1s ease-in-out;
    .loading {
      color: ${({ themeColor }) => themeColor};
      z-index: 996;
      font-size: 0.22rem;
      font-weight: 800;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
    .iframe-container {
      z-index: 998;
      overflow: hidden;
      /* 16:9 aspect ratio */
      /* padding-top: 56.25%; */
      height: 100%;
      position: relative;
      transition: all 0.5s ease-in-out;
      iframe {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        border: 0;
      }
    }

    @media screen and (max-width: 414px) {
      width: 5rem;
      .add {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  }
  &.loading .modal {
    background: rgba(2, 2, 2, 0.8);
  }
  .setting {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0.2rem;
    right: 0.2rem;
    font-size: 0.1rem;
    z-index: 999;
    .btn {
      background: #fff;
      width: 0.4rem;
      height: 0.4rem;
      padding: 0.1rem;
      border: 1px solid ${({ themeColor }) => themeColor};
      border-radius: 50%;
      box-shadow: 0 0 8px 2px #484848;
      &:not(:last-child) {
        margin-bottom: 0.1rem;
      }
      img {
        width: 100%;
      }
    }
  }
  .close {
    z-index: 999;
    cursor: pointer;
    width: 0.4rem;
    height: 0.4rem;
    background: #fff;
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
    border-radius: 50%;
    border: 1px solid #222;
    box-shadow: 0 0 8px 2px #484848;
    &:before,
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
      display: block;
      background-color: #333;
    }
    &:before {
      width: 0.24rem;
      height: 2px;
    }
    &:after {
      width: 2px;
      height: 0.24rem;
    }
  }
  .info {
    position: absolute;
    left: 0.1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.2rem;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 999;
    .logo {
      width: 0.5rem;
      height: 0.5rem;
      border: 1px solid ${({ themeColor }) => themeColor};
      border-radius: 50%;
      padding: 0.12rem;
      margin-bottom: 0.2rem;
      img {
        width: 100%;
      }
    }
    .title {
      writing-mode: vertical-lr;
      letter-spacing: 0.05rem;
      text-shadow: 0 0 7px ${({ themeColor }) => themeColor};
    }
  }
`;
const SizeMap = {
  mobile: {
    width: '375px',
    height: '667px'
  },
  pc: {
    width: '100vw',
    height: '100vh'
  }
};
export default function PreviewModal({ app = {}, resetCurrApp }) {
  const { url = '', title = '', icon = '', themeColor, size = 'pc' } = app;
  const initialSize = SizeMap[size] || { width: '8.16rem', height: 'auto' };
  const [screenSize, setScreenSize] = useState(initialSize);
  const [loading, setLoading] = useState(true);
  const [aniEnd, setAniEnd] = useState(false);

  const iframe = useRef(null);
  const prModal = useRef(null);
  const handleAniEnd = () => {
    console.log('ani end');
    setTimeout(() => {
      setAniEnd(true);
    }, 500);
  };
  const handleIframeLoad = () => {
    // setLoaded(true);
    let iframeEle = iframe.current;
    try {
      var bHeight = iframeEle.contentWindow.document.body.scrollHeight;
      var dHeight = iframeEle.contentWindow.document.documentElement.scrollHeight;
      var height = Math.min(bHeight, dHeight);
      iframeEle.height = height + 50;
      console.log(iframe.height);
    } catch (ex) {
      console.log({ ex });
    } finally {
      setLoading(false);
    }
  };
  const handleScreenSize = (key) => {
    let size = SizeMap[key] || {};
    setScreenSize(size);
  };
  const handleFullScreen = () => {
    iframe.current.requestFullscreen();
  };
  useEffect(() => {
    const modalEle = prModal || prModal.current;
    disableBodyScroll(modalEle);
    return () => {
      enableBodyScroll(modalEle);
    };
  }, []);
  return url ? (
    <ModalWrapper ref={prModal}>
      <StyledWrapper {...screenSize} themeColor={themeColor} className={loading ? 'loading' : ''}>
        <div className="modal" onAnimationEnd={handleAniEnd}>
          {loading && <div className="loading">加载中...</div>}
          <div className="iframe-container">
            {aniEnd && (
              <iframe
                rel="nofollow"
                ref={iframe}
                src={url}
                onLoad={handleIframeLoad}
                frameBorder="0"
              ></iframe>
            )}
          </div>
        </div>
        <div onClick={resetCurrApp} className="close" />
        <div className="info">
          <div className="logo">
            <img src={icon ? icon : `${getDefaultIcon(url)}`} alt="图标" />
          </div>
          <h2 className="title">{title}</h2>
        </div>
        <div className="setting">
          <button
            className="btn"
            onClick={() => {
              handleScreenSize('mobile');
            }}
          >
            <img src={IconMobile} alt="手机视图" />
          </button>
          <button
            className="btn"
            onClick={() => {
              handleScreenSize('pc');
            }}
          >
            <img src={IconPC} alt="PC视图" />
          </button>
          <button className="btn" onClick={handleFullScreen}>
            <img src={IconFS} alt="全屏" />
          </button>
          <a className="btn" href={url} target={'_blank'}>
            <img src={IconOpen} alt="新窗口打开" />
          </a>
        </div>
      </StyledWrapper>
    </ModalWrapper>
  ) : null;
}

const ModalWrapper = ({ children }) => {
  return createPortal(children, modalRoot);
};
