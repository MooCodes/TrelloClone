import styled from "styled-components";

export const ListsContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;
  height: 85vh;
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 3px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const BoardName = styled.h2`
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
`;
