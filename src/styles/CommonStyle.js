import { createGlobalStyle } from "styled-components";

export const CommonStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: "Pretendard", sans-serif;
    background-color: #ffffff;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font: inherit;
  }
`;
