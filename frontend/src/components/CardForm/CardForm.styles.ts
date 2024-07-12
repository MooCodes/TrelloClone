import styled from "styled-components";

export const CardFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  margin: 0px 10px 10px 10px;
`;

export const CardTitleContainer = styled.div`
  background-color: #22272b;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardTitleInput = styled.input`
  background-color: #22272b;
  border: none;
  font-size: 14px;
  font-weight: normal;
  color: #b6c2cf;
  margin: 0;
  width: 100%;

  &:focus {
    outline: none;
  }
`;

export const CardButton = styled.button`
  align-self: flex-start;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
`;
