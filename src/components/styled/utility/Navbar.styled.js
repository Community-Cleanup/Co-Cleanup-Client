import styled from "styled-components";

export const StyledNavbar = styled.nav`
  background-color: ${({ theme }) => theme.colors.navbar};
  height: 50px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: min-content;
  }

  input {
    width: 300px;
  }
`;
