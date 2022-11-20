import styled from "styled-components";
import { theme } from "../theme/Theme";

export const StyledNavbar = styled.nav`
  background-color: ${({ bg }) => bg || theme.colors.navbar};
  color: ${({ color }) => color || "black"};
  height: ${({ h }) => h || "60px"};
  padding: ${({ pad }) => pad || "0 12px"};
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* width: min-content; */
  }

  input {
    width: 300px;
  }
`;
