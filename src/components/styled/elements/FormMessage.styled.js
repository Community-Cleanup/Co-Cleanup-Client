import styled from "styled-components";
import { theme } from "../theme/Theme";

export const FormMessage = styled.p`
  color: ${({ color }) => color || theme.colors.formMessage};
  font-size: 12px;
  margin-top: 4px;
`;
