import styled from 'styled-components';

const StyledBox = styled.div`
  box-sizing: border-box;
  height: 200px;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 5px;
  background-color: var(--camera-bg-color);
  border-radius: var(--border-radius);
  .link {
    width: 95%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    background: var(--button-bg-color);
    border-radius: var(--border-radius);
    font-size: 10px;
    .url {
      color: var(--font-color);
      width: 100%;
      height: fit-content;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-word;
      text-align: left;
      line-height: 1.2;
      max-height: 90px;
      overflow: hidden;
    }
  }
  .users {
    height: fit-content;
    overflow: scroll;
    width: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background-color: #1f1f1f;
    padding: 6px 4px;
    border-radius: var(--border-radius);
    color: var(--font-color);
    &::-webkit-scrollbar {
      /* visibility: hidden; */
      display: none;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: transparent;
    }

    .user {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:not(:last-child) {
        padding-bottom: 4px;
        border-bottom: 1px dashed #333;
      }
      .avator {
        width: 25px;
        height: 25px;
        border-radius: 50%;
      }
      .name {
        color: inherit;
        font-size: 10px;
      }
    }
  }
  .login {
    margin-top: 15px;
    padding: 10px 20px;
    background-color: #c4c4c4;
  }
`;
export default StyledBox;