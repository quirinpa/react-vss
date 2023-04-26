export type Css = { [key: string]: any };
export type MagicBook = { [word: string]: Css };
export type Magic = { [word: string]: string };

interface Color {
  light: string;
  main: string;
  dark: string;
  contrastText: string;
}

interface Palette {
  // common: {
  //   white: string;
  //   black: string;
  // };
  type: string;
  primary: Color;
  secondary: Color;
  success: Color;
  warning: Color;
  error: Color;
  info: Color;
  // grey: {
  //   100: string;
  //   500: string;
  //   900: string;
  // };
  divider: string;
  text: {
    primary: string;
    secondary: string;
    // disabled: string;
    // icon: string;
  },
  background: {
    paper: string;
    default: string;
  }
}

export
interface OptSpacingOctave {
  func?: Function;
  min?: number;
  max?: number;
  step?: number;
}

export
interface SpacingOctave extends OptSpacingOctave {
  func: Function;
  min: number;
  max: number;
  step: number;
}

export interface Theme {
  palette: Palette;
  spacing: [SpacingOctave, ...SpacingOctave[]];
  typography: {
    htmlFontSize: number;
    fontFamily: string;
    fontSize: number;
    h1: Css;
    h2: Css;
    h3: Css;
    h4: Css;
    h5: Css;
    h6: Css;
    subtitle2: Css;
    caption: Css;
  };
}

export
interface WithThemeProps {
  theme?: string;
}

export
interface WithClassesProps {
  classes: Magic;
}

export type makeMagicType = (mb: MagicBook, prefix?: string) => Magic;
export type makeThemeMagicBookType = (theme: Theme, name: string) => MagicBook;
export type getThemeMagicType = (theme: string, getStyle: makeThemeMagicBookType) => Magic;

export type withMagicType = (
  Component: React.ComponentType<WithThemeProps> ,
  getStyle?: makeThemeMagicBookType,
) => React.ComponentType<WithThemeProps>;
