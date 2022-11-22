import styled from "styled-components";
import { theme } from "../theme/Theme";

// DropDown is used for the mobile view drop down hamburger menu
// the height is set to 0. This value is changed when the hamburger icon is clicked to allow the menu to open into view
export const DropDown = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  height: 0;
  width: 250px;
  overflow: hidden;
  text-align: left;
  transition: all 0.2s linear;
  z-index: 10;
`;
