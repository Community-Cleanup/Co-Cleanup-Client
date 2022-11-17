import styled from "styled-components";

export const StyledNavbar = styled.nav`
    background-color: ${({theme}) => theme.colors.navbar};
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`