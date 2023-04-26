import { Theme as MuiTheme } from "@material-ui/core";
export type Css = { [key: string]: any };
export type MagicBook = { [word: string]: Css };
export type Magic = { [word: string]: string };

export
interface SpacingOctave {
  func?: Function;
  min?: number;
  max?: number;
  step?: number;
}

export interface Theme extends Omit<MuiTheme, "spacing"> {
  spacing?: SpacingOctave[];
}

export
interface SimpleThemeProps {
  theme: string;
}

export
interface WithThemeProps extends SimpleThemeProps {
  className?: string;
  [key: string]: any;
}

export type makeMagicType = (mb: MagicBook) => Magic;
export type makeThemeMagicBookType = (name: string, theme: Theme) => MagicBook;
export type getMagicThemeType = (theme: string) => Theme;
export type getThemeMagicType = (theme: string, getTheme: getMagicThemeType, getStyle: makeThemeMagicBookType) => Magic;

export type withMagicType = (
  Component: React.ComponentType<SimpleThemeProps> ,
  dependencies?: Dependencies,
  context?: boolean,
) => React.ComponentType<WithThemeProps>;

export
interface Dependencies {
  "@tty-pt/styles"?: {
    makeMagic?: makeMagicType;
    getThemeMagic?: getThemeMagicType;
    withMagic?: withMagicType;
    getMagicTheme?: getMagicThemeType;
    makeThemeMagicBook?: makeThemeMagicBookType;
  },
}
