import styled from "styled-components";

export const CardLg = styled.div`
  background-color: ${({ bg }) => bg || "white"};
  margin: ${({ margin }) => margin || "0"};
  border-radius: 6px;
  border: ${({ bord }) => bord || "none"};
  width: ${({ w }) => w || "auto"};
  max-width: ${({ maxw }) => maxw || "100%"};
  height: ${({ h }) => h || "auto"};
  max-height: ${({ maxh }) => maxh || "100%"};
  padding: ${({ pad }) => pad || "16px"};
`;
