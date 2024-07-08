import styled from 'styled-components';

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #101204;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  width: 250px;
  gap: 10px;
  height: 100%;
  overflow-y: auto;
  cursor: pointer;
`;


export const ListTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  color: #B6C2CF;
  margin: 0;
  margin-left: 5px;
`;