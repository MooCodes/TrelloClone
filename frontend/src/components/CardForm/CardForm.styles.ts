import styled from "styled-components";

export const CardFormContainer = styled.form`
  display: flex;
  flex-direction: column;
`;

export const CardTitleContainer = styled.div`
  background-color: #e9ecef;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const CardTitleInput = styled.input`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
  width: 100%;
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
`
