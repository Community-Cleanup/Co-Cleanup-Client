import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Inter, sans-serif;
        text-decoration: none;
    }
    a, a:visited, a:hover, a:active {
        color: inherit;
    }
`;

export default GlobalStyles;
