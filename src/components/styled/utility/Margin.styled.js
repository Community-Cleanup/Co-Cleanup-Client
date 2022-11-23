import styled from "styled-components";

// applied when elements or containers need just margin
export const Margin = styled.div`
  margin: ${({ margin }) => margin || "4%"};
`;
