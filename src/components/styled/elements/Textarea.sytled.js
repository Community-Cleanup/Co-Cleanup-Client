import styled from "styled-components";
import { theme } from "../theme/Theme";

export const Textarea = styled.textarea`
  border: 1px solid ${theme.colors.inputBorder};
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  height: ${({ h }) => h || "auto"};
  width: ${({ w }) => w || "100%"};
  padding: ${({ pad }) => pad || "0px 20px"};
`;
