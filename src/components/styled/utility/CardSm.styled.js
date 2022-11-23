import styled from "styled-components";
import { theme } from "../theme/Theme";

// CardSm is used for small cards like the event cards on the event search page
export const CardSm = styled.div`
  cursor: ${({ cursor }) => cursor || "default"};
  background-color: ${({ bg }) => bg || "white"};
  margin: ${({ margin }) => margin || "0"};
  border-radius: 6px;
  border: ${({ bord }) => bord || "none"};
  width: ${({ w }) => w || "auto"};
  max-width: ${({ maxw }) => maxw || "100%"};
  height: ${({ h }) => h || "auto"};
  max-height: ${({ maxh }) => maxh || "100%"};
  padding: ${({ pad }) => pad || "16px"};

  &:hover {
    box-shadow: ${({ bs }) =>
      bs === "true" && `0px 4px 10px 2px ${theme.colors.shadow}`};
  }
`;
