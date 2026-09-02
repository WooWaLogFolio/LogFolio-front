import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import { CommonStyle } from "./styles/CommonStyle";
import Router from "./routes/Router";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CommonStyle />
      <Router />
    </ThemeProvider>
  );
}

export default App;