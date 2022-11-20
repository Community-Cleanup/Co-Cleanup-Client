import styled from "styled-components";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 320px));
  grid-template-rows: 1fr;
  gap: 16px;
`;
