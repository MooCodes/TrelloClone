import styled from "styled-components";

export const BoardContainer = styled.div`
  position: relative;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 3px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  width: 250px;
  height: 100px;
  cursor: pointer;
  margin-right: 20px;

  &:hover {
    background-color: #e9ecef;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

export const BoardDeleteButton = styled.button`
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c82333;
  }
`;

export const BoardGoButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;