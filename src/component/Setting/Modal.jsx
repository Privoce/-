import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { saveAs } from 'file-saver';
import { useLanguage } from 'uselanguage';
import languages from '../../lang';
import IconClose from '../../asset/img/icon.close.png';
import { useWidgetSettings } from '../../hooks';
import { AiOutlineClear, AiOutlineMessage, AiOutlineExport, AiOutlineImport } from 'react-icons/ai';
import { GrPowerReset } from 'react-icons/gr';
const modalRoot = document.querySelector('#modal-root');
const StyledWrapper = styled.section`
  z-index: 999;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  .modal {
    position: relative;
    background: var(--modal-bg-color);
    border-radius: 0.04rem;
    padding: 0.3rem 0.5rem;
    /* padding: 0.7rem 0.25rem 0.35rem 0.25rem; */
    width: fit-content;
    .tip {
      font-size: 0.12rem;
      color: #aaa;
      margin-top: 0.5rem;
      &:before {
        content: 'ℹ️';
        padding-right: 0.06rem;
      }
    }
    .settings {
      display: flex;
      flex-direction: column;
      .setting {
        display: flex;
        &:not(:last-child) {
          margin-bottom: 0.2rem;
          padding-bottom: 0.2rem;
          border-bottom: 1px dashed #eee;
        }
        .btn {
          display: flex;
          background-color: #5072f0;
          color: #fff;
          font-size: 0.18rem;
          border-radius: 4px;
          border: 1px solid #fff;
          padding: 0.1rem 0.15rem;
          align-items: center;
          > svg {
            margin-left: 0.05rem;
            width: 0.2rem;
            height: 0.2rem;
          }
          &:not(:last-child) {
            margin-right: 0.15rem;
          }
          &.reset {
            background-color: #f88070;
            svg path {
              stroke: #fff;
            }
          }
          /* &.feedback {
            background-color: #2b7cfb;
          } */
          &.import {
            position: relative;
            cursor: pointer;
            input[type='file'] {
              opacity: 0;
              cursor: pointer;
              position: absolute;
              display: block;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
            }
          }
          &[disabled] {
            background-color: #999;
            color: #fff;
          }
        }
      }
    }
    .close {
      cursor: pointer;
      position: absolute;
      top: 0.16rem;
      right: 0.16rem;
      width: 0.16rem;
      height: 0.16rem;
    }
    @media screen and (max-width: 414px) {
      width: 5rem;
    }
  }
`;
// let other_params = {};
export default function Modal({ closeModal }) {
  const {
    language: {
      words: { setting }
    }
  } = useLanguage();

  const {
    widgetSettings,
    clearWidgetSettings,
    getWidgetSetting,
    updateWidgetSetting,
    importWidgetSettings
  } = useWidgetSettings();
  const modal = useRef(null);
  useEffect(() => {
    let modalEle = modal || modal.current;
    if (modalEle) {
      disableBodyScroll(modalEle);
    }
    return () => {
      enableBodyScroll(modalEle);
    };
  }, []);
  const handleExport = () => {
    console.log({ widgetSettings });
    let blob = new Blob([JSON.stringify(widgetSettings)], {
      type: 'application/json;charset=utf-8'
    });
    saveAs(blob, `portal.widget.data.${format(new Date(), 'yyyy-MM-dd-hh-mm-ss')}.json`);
  };
  const handleReset = () => {
    if (confirm('您可以先导出数据备份到本地，该操作将清除本地全部数据，恢复初始状态，确定操作？')) {
      clearWidgetSettings();
      location.reload();
    }
  };
  const handleFileImport = ({ target: { files } }) => {
    alert('温馨提示：如果当前数据未备份，建议先导出备份');
    const [file] = files;
    var reader = new FileReader();
    reader.onload = ({ target: { result } }) => {
      importWidgetSettings(result);
      alert('导入成功，刷新页面即可加载导入数据！');
      // location.reload();
    };
    reader.readAsText(file);
    console.log({ file });
  };
  const handleResetBackground = () => {
    if (confirm('您确定要去掉页面背景图？')) {
      updateWidgetSetting({ key: 'bg', data: '' });
      location.reload();
    }
  };
  const { language, setLanguage } = useLanguage();

  const handleChangeLanguage = (e) => {
    const filteredLanguage = languages.find((lang) => lang.value === e.target.value);

    setLanguage(filteredLanguage);
  };
  let currPageBg = getWidgetSetting({ key: 'bg' });
  return (
    <ModalWrapper ref={modal}>
      <StyledWrapper>
        <div className="modal">
          <ul className="settings">
            <li className="setting">
              <button
                className="btn clearBg"
                disabled={!currPageBg}
                onClick={handleResetBackground}
              >
                {setting.clear}
                <AiOutlineClear />
              </button>
            </li>
            <li className="setting">
              <button className="btn export" disabled={!widgetSettings} onClick={handleExport}>
                {setting.export}
                <AiOutlineExport />
              </button>
              <button className="btn import">
                {setting.import}
                <AiOutlineImport />
                <input type="file" accept="application/*" onChange={handleFileImport}></input>
              </button>
            </li>

            <li className="setting">
              <button className="btn reset" disabled={!widgetSettings} onClick={handleReset}>
                {setting.reset}
                <GrPowerReset />
              </button>
              <a
                className="btn feedback"
                href={'https://support.qq.com/product/303691'}
                target="_blank"
              >
                {setting.feedback}
                <AiOutlineMessage />
              </a>
            </li>
            <li className="setting">
              <select className="btn langs" onChange={handleChangeLanguage} value={language.value}>
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.title}
                  </option>
                ))}
              </select>
            </li>
          </ul>
          {!widgetSettings ? <h2 className="tip">{setting.tip}</h2> : null}
          <img src={IconClose} onClick={closeModal} className="close" />
        </div>
      </StyledWrapper>
    </ModalWrapper>
  );
}

const ModalWrapper = ({ children }) => {
  return createPortal(children, modalRoot);
};
