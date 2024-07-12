import styled from 'styled-components';

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

export const ListTitle = styled.h3`
  font-size: 14px;
  font-weight: bold;
  color: #B6C2CF;
  margin: 0;
  padding: 10px;
  padding-left: 20px;
`;

export const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;