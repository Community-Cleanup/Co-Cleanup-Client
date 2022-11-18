import styled from "styled-components";
import { theme } from "../theme/Theme";

export const Navigation = styled.span`
  cursor: pointer;
  color: ${({ color }) => color || theme.colors.navigationLink};
  background-color: transparent;
  border: none;
  font-size: ${({ fs }) => fs || "12px"};
  font-weight: 500;
  white-space: nowrap;
  width: 100%;
  margin: ${({ margin }) => margin || "0"};
`;
