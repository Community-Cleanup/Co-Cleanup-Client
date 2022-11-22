import styled from "styled-components";
import { theme } from "../theme/Theme";

// Input is the default input field style
export const Input = styled.input`
  border: 1px solid ${theme.colors.inputBorder};
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  height: 35px;
  width: ${({ w }) => w || "100%"};
  padding: 0 20px;

  @media (max-width: 900px) {
    width: "300px";
  }

  @media (max-width: 450px) {
    width: ${({ wmobile }) => wmobile};
  }
`;
