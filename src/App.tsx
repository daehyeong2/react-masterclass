import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import Router from "./Router";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { darkTheme, lightTheme } from "./theme";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "./atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
config.autoAddCss = true;

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
*{
  box-sizing: border-box;
}
body{
  font-family: 'Source Sans Pro', sans-serif;
  background-color: ${(props) => props.theme.bgColor};
  transition: background-color .1s ease-in-out;
  color: ${(props) => props.theme.textColor};
  ::-webkit-scrollbar {
    display: none;
}
}
a{
  text-decoration: none;
  color: inherit;
}
`;
interface DarkModeProps {
  isDark: boolean;
}

const DarkMode = styled.div<DarkModeProps>`
  transition: background-color 0.1s ease-in-out;
  position: absolute;
  left: 20px;
  bottom: 20px;
  background-color: ${(props) => (props.isDark ? "white" : "black")};
  box-shadow: 1px 1px;
  padding: 5px;
  border-radius: 13px;
  cursor: pointer;
  svg {
    color: ${(props) => (props.isDark ? "black" : "white")};
    width: 35px;
    height: 35px;
  }
`;

function App() {
  const isDark = useRecoilValue(isDarkAtom);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => {
    setDarkAtom((current) => !current);
  };
  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <Router />
        <DarkMode isDark={isDark} onClick={toggleDarkAtom}>
          <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
        </DarkMode>
      </ThemeProvider>
    </>
  );
}

export default App;
