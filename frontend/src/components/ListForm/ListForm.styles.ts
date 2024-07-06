import styled from 'styled-components';

export const ListFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
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

export const ListTitleInput = styled.input`
  width: 100%;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

export const ListFormButton = styled.button`
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