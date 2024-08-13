import styled from "styled-components";

// export const ListsContainer = styled.div`
//   display: inline-flex;
//   align-items: flex-start;
//   width: 100%;
//   padding: 20px;
//   border-radius: 3px;
// `;

export const ListsContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #7b3123;
  margin: 10px;
  overflow-x: auto;
  white-space: nowrap;
  height: 85vh;
`;

export const ListsHeader = styled.div`
  display: flex;
  align-items: center;
  background-color: #5e251b;
  gap: 20px;
`;

export const ListsInviteButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #3869d4;
  font-size: 18px;
  font-weight: 600;
  margin-right: 20px;
`;

export const BoardName = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-left: 20px;
  color: #fff;
`;
