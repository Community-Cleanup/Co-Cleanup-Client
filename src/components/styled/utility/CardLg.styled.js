import styled from "styled-components";

export const CardLg = styled.div`
  background-color: ${({ bg }) => bg || "white"};
  margin: ${({ margin }) => margin || "0"};
  border-radius: 6px;
  width: ${({ w }) => w || "auto"};
  height: ${({ h }) => h || "auto"};
  padding: ${({ pad }) => pad || "16px"};
`;
