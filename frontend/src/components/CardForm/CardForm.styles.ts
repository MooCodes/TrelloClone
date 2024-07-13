import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

export const CardTitleInput = styled.textarea`
  background-color: #22272b;
  border: none;
  font-size: 14px;
  font-weight: normal;
  color: #b6c2cf;
  margin: 0;
  width: 100%;
  min-height: 21px;
  height: 100%;
  overflow: hidden;

  resize: none;

  &:focus {
    outline: none;
  }
`;

export const CardButton = styled.button`
  align-self: flex-start;
  background-color: #579dff;
  color: #1d2125;
  border: none;
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #6eb5ff;
  }
`;

export const ShowCardForm = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  color: #99a6b4;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin: 0 auto;
  margin-bottom: 10px;
  height: 100%;
  width: 230px;
  cursor: pointer;

  span {
    font-weight: bold;
    font-size: 14px;
  }

  &:hover {
    background-color: rgba(50, 50, 50, 0.5);
    border-color: #007bff;
  }
`;

export const CardButtonFormContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  color: #b6c2cf;
  padding: 10px;
  margin-top: 10px;

  &:hover {
    border-color: #007bff;
    background-color: rgba(50, 50, 50, 0.8);
  }
`;
