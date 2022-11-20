import styled from "styled-components";

export const Span = styled.span`
  display: inline-block;
  color: ${({ color }) => color || "black"};
  font-size: ${({ fs }) => fs || "inherit"};
  font-weight: ${({ fw }) => fw || "inherit"};
  margin: ${({ margin }) => margin || "0"};
  text-transform: ${({ tf }) => tf || "none"};
`;
