import styled from "styled-components";

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #22272b;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(9, 45, 66, 0.25);
  padding: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
  margin-left: 10px;
  word-break: break-all;
`;

export const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: normal;
  color: #b6c2cf;
  margin: 0;
`;

export const CardTitleInput = styled.textarea`
  background-color: #22272b;
  border: none;
  font-size: 14px;
  font-weight: normal;
  color: #b6c2cf;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  resize: none;
  padding: 0px;
  height: fit-content;
  field-sizing: content;

  &:focus {
    outline: 1px solid #66afe9;
    outline-offset: 10px;
    border-radius: 2px;
  }
`;
