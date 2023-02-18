export type Cast = (phrase: string) => string;
type Css = { [key: string]: any };
export type MagicBook = { [word: string]: Css };
export type Magic = { [word: string]: string };

interface ThemeColor {
  main: string,
  light: string,
}

export
interface Theme {
  typography: {
    caption: Css,
    h3: Css,
    h4: Css,
    h5: Css,
    h6: Css,
    subtitle2: Css,
  },
  palette: {
    text: {
      primary: string,
      secondary: string,
    },
    success: ThemeColor,
    warning: ThemeColor,
    error: ThemeColor,
    divider: string,
  }
}

export
interface CastProps {
  c: (phrase: string) => string,
  [key: string]: any,
}

export
interface MagicBookProps {
  classes: Magic,
}
