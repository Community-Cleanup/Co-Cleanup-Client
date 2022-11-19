import styled from "styled-components";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 400px));
  grid-auto-rows: 1fr;
  gap: 16px;
`;
