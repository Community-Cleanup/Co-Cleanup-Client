import styled from "styled-components";
import { theme } from "../theme/Theme";

export const Input = styled.input`
  border: 1px solid ${theme.colors.inputBorder};
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  height: 35px;
  width: ${({ w }) => w || "100%"};
  padding: 0 20px;
`;
