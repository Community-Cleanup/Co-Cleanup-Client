import styled from "styled-components";
import { theme } from "../theme/Theme";

export const DropDownBtn = styled.div`
  background-color: ${({ theme }) => theme.colors.navbar};
  color: ${({ theme }) => theme.colors.navigationLink};
  cursor: pointer;
  border-top: 1px solid ${({ theme }) => theme.colors.dropBorder};
  font-size: 14px;
  padding: 16px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dropBorder};
  }
`;
