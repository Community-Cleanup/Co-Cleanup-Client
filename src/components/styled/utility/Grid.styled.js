import styled from "styled-components";

// Default grid styling
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 320px));
  grid-template-rows: 1fr;
  justify-content: ${({ justifycontent }) => justifycontent || "left"};
  gap: 16px;
`;
