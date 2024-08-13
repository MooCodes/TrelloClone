import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  word-wrap: break-word;
  white-space: pre-line;
  position: relative;
  z-index: 0;

  &:hover {
    outline: 2px solid #66afe9;
  }
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
    outline: none;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  top: 0px;
  right: 0px;
  position: absolute;
  flex-direction: row;
`;

export const FaPencil = styled(FontAwesomeIcon)`
  color: #b6c2cf;
  margin-top: 5px;
  margin-right: 5px;
  padding: 5px;
  cursor: pointer;
  border-radius: 10px;

  background-color: #22272b;

  &:hover {
    background-color: #2a2d32;
  }
`;

export const FaTrash = styled(FontAwesomeIcon)`
  color: #b6c2cf;
  margin-top: 5px;
  padding: 5px;
  cursor: pointer;
  border-radius: 10px;

  background-color: #22272b;

  &:hover {
    background-color: #2a2d32;
  }
`;
