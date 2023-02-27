import { Theme } from "@material-ui/core";
export type Cast = (phrase: string) => string;
type Css = { [key: string]: any };
export type MagicBook = { [word: string]: Css };
export type Magic = { [word: string]: string };

export
interface CastProps {
  c: (phrase: string) => string,
  [key: string]: any,
}

export
interface MagicClassesProps {
  classes: Magic,
}

export
interface Dependencies {
  "@tty-pt/styles"?: {
    MagicContext?: React.Context<Magic>,
    makeMagic?: (mb: MagicBook) => Magic,
  },
}

export
interface CastComponentProps {
  dependencies?: Dependencies,
  [key: string]: any,
}

export
interface WithThemeProps {
  theme?: Theme,
  [key: string]: any,
}
