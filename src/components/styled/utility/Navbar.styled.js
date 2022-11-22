import styled from "styled-components";
import { theme } from "../theme/Theme";

// used for the Navigation bar and footer
export const StyledNavbar = styled.nav`
  background-color: ${({ bg }) => bg || theme.colors.navbar};
  color: ${({ color }) => color || "black"};
  min-height: ${({ h }) => h || "60px"};
  padding: ${({ pad }) => pad || "0 12px"};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;
