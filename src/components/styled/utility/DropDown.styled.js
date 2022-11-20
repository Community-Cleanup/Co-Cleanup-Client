import styled from "styled-components";
import { theme } from "../theme/Theme";

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
