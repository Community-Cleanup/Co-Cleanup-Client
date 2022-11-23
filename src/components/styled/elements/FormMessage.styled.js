import styled from "styled-components";
import { theme } from "../theme/Theme";

//FormMessage is used to style any popup messages in forms, e.g sign up message when password is incorrect
export const FormMessage = styled.p`
  color: ${({ color }) => color || theme.colors.formMessage};
  font-size: 12px;
  margin: ${({ margin }) => margin || "4px 0 0 0"};
`;
