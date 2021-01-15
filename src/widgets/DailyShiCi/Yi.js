import { useState } from 'react';
import styled from 'styled-components';
import IconClose from '../Common/Icons/Close';
const StyledIcon = styled.div`
  position: absolute;
  left: 0.32rem;
  top: 0.1rem;
  /* width: 0.2rem;
  height: 0.2rem; */
  z-index: 885;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.4;
  font-size: 0.1rem;
  padding: 0.04rem;
  border-radius: 50%;
  line-height: 1;
  border: 1px solid #666;
  &:hover {
    opacity: 1;
  }
`;
const StyledWrapper = styled.div`
  position: relative;
  padding: 0.2rem;
  background-color: #333;
  color: #fff;
  z-index: 885;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  font-size: 0.2rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  .lines {
    padding: 0.05rem 0.1rem;
    .line {
      font-size: 0.14rem;
      line-height: 1.3;
      margin-bottom: 0.2rem;
    }
  }
  .icon_close {
    position: absolute;
    right: 0.1rem;
    top: 0.1rem;
    width: 0.2rem;
    height: 0.2rem;
    cursor: pointer;
  }
`;

export default function Tabs({ content }) {
  const [tabExpand, setTabExpand] = useState(false);
  const toggleTabExpand = () => {
    setTabExpand((prev) => !prev);
  };
  if (!tabExpand) return <StyledIcon onClick={toggleTabExpand}>译</StyledIcon>;
  return (
    <StyledWrapper>
      <IconClose className="icon_close" onClick={toggleTabExpand} />
      <div className="lines">
        {content.map((c) => {
          return (
            <p className={`line`} key={c}>
              {c}
            </p>
          );
        })}
      </div>
    </StyledWrapper>
  );
}