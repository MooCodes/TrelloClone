import styled from "styled-components";

// export const ListsContainer = styled.div`
//   display: flex;
//   gap: 20px;
//   flex-direction: row;
//   flex-wrap: wrap;
//   align-items: flex-start;
//   width: 100%;
//   padding: 20px;
//   background-color: #f8f9fa;
//   border: 1px solid #ddd;
//   border-radius: 3px;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
// `;

export const ListsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  background-color: #7B3123;
  margin: 10px;
`;

export const ListsHeader = styled.div`
  display: flex;
  align-items: center;
  background-color: #5E251B;
  gap: 20px;
`;

export const ListsInviteButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #3869D4;
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
