import styled from "styled-components";

export const BoardContainer = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 3px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  width: 250px;
  height: 100px;
  cursor: pointer;

  &:hover {
    background-color: #e9ecef;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-color: #007bff;
  }
`;

export const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const BoardTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
  text-align: center;
`;
