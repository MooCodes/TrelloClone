import styled from "styled-components";

export const BoardFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 3px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  width: 250px;
  height: 100px;

  &:hover {
    background-color: #e9ecef;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-color: #007bff;
  }
`;


export const BoardTitleInput = styled.input`
  width: 100%;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

export const BoardTitleText = styled.span`
  margin: 0;
  padding: 0;
  position: relative;
  font-size: 12px;
  color: #aaa;
`

export const BoardAddButton = styled.button`
  background-color: #007bff;
  color: white;
  font-size: 16px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;