import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ListFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  background-color: #101204;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  width: 250px;
  height: 100%;
`;

export const ListTitleInput = styled.input`
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  background-color: #22272b;
  border: none;
  border-radius: 4px;
  color: #8c9bab;
  padding: 5px;
  padding-left: 10px;
`;

export const ListFormButton = styled.button`
  align-self: flex-start;
  background-color: #579dff;
  color: #1d2125;
  border: none;
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
  font-weight: normal;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
`;

export const ShowListForm = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  background-color: #9b6258;
  color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  width: 250px;
  height: 100%;
  cursor: pointer;

  span {
    font-weight: bold;
    font-size: 14px;
  }

  &:hover {
    background-color: #7e493e;
    border-color: #007bff;
  }
`;

export const ListFormButtonContainer = styled.div`
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
