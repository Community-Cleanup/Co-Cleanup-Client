import styled from "styled-components";
import { theme } from "../theme/Theme";

export const CardSm = styled.div`
  cursor: ${({ cursor }) => cursor || "default"};
  background-color: ${({ bg }) => bg || "white"};
  margin: ${({ margin }) => margin || "0"};
  border-radius: 6px;
  width: ${({ w }) => w || "auto"};
  height: ${({ h }) => h || "auto"};
  padding: ${({ pad }) => pad || "16px"};

  &:hover {
    box-shadow: ${({ bs }) =>
      bs === "true" && `0px 4px 10px 2px ${theme.colors.shadow}`};
  }
`;
