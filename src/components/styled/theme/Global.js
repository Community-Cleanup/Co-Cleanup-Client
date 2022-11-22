import { createGlobalStyle } from "styled-components";

// global styles are applied to all JSX and styled components
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
    h1 {
        margin: 12px 0 24px;
    }
    h2 {
        margin: 10px 0 20px;
    }
    h3 {
        margin: 8px 0 10px;
    }
    h4 {
        margin: 4px 0 4px;
    }
`;

export default GlobalStyles;
