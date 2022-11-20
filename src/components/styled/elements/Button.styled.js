import styled from "styled-components";
import { theme } from "../theme/Theme";

export const Button = styled.button`
  cursor: pointer;
  color: ${({ color }) => color || "white"};
  background-color: ${({ bg }) => bg || theme.colors.buttonOne};
  border: none;
  border-radius: 4px;
  font-size: ${({ fs }) => fs || "12px"};
  font-weight: ${({ fw }) => fw || "500"};
  margin: ${({ margin }) => margin || "0 5px"};
  width: ${({ w }) => w || "auto"};
  white-space: nowrap;
  padding: ${({ pad }) => pad || "10px 20px"};
  transition: 0.2s ease all;

  &:hover {
    opacity: 0.9;
    transform: scale(0.99);
  }
`;
