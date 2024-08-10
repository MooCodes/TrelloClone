import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #101204;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 250px;
  height: 100%;
  overflow-y: auto;
  margin-right: 20px;
  margin-bottom: 20px;
`;

export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 5px;
`;

export const StyledEllipsis = styled(FontAwesomeIcon)`
  color: #b6c2cf;
  margin-right: 10px;
  margin-top: 5px;
  padding: 10px;
  cursor: pointer;
  border-radius: 10px;

  &:hover {
    border-color: #007bff;
    background-color: rgba(50, 50, 50, 0.8);
  }
`;

export const ListTitle = styled.h3`
  font-size: 14px;
  font-weight: bold;
  color: #b6c2cf;
  margin: 0;
  width: 100%;
  padding: 15px 10px 10px 20px;
`;

export const ListTitleInput = styled.input`
  font-size: 14px;
  width: 100%;
  font-weight: bold;
  background-color: #22272b;
  color: #b6c2cf;
  margin-top: 10px;
  margin-left: 15px;
  margin-bottom: 5px;
  padding: 5px;
  border: none;
  border-radius: 4px;

  &:focus {
    outline: 1px solid #66afe9;
  }
`;

export const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
