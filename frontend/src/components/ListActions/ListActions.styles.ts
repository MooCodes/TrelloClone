import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ListActionsContainer = styled.div`
  position: absolute;
  color: white;
  height: fit-content;
  width: 250px;
  background-color: #282e33;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  right: 0;
`;

export const ListActionsHeader = styled.div`
  font-size: 14px;
  display: grid;
  grid-template-columns: 32px 1fr 32px;
  align-items: center;
  font-weight: normal;
  color: #b6c2cf;
  margin-top: 5px;
`;

export const ListActionTitle = styled.h3`
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  color: #b6c2cf;
  margin: 0;
  padding: 10px;
`;

export const ListActionTrash = styled(FontAwesomeIcon)`
  color: #b6c2cf;
  cursor: pointer;
  padding: 5px;
  margin: 5px;

  &:hover {
    border-color: #007bff;
    background-color: rgba(50, 50, 50, 0.8);
  }
`;

export const ListActionDelete = styled.button`
  background-color: #dc3545;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  cursor: pointer;
  margin: 10px;
  padding: 5px;

  &:hover {
    background-color: #c82333;
  }
`;
