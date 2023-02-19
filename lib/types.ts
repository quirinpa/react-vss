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
interface CastComponentProps {
  dependencies?: {
    MagicContext?: React.Context<Magic>,
  },
  [key: string]: any,
}
