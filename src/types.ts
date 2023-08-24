import React from "react";

export type Css = { [key: string]: any };
export type MagicBook = { [word: string]: Css };
export type Magic = { [word: string]: string };

export type OctaveFunc<P extends any> = (x: number) => [any, P];

export
interface OptOctave<P extends any> {
  func?: OctaveFunc<P>;
  min?: number;
  length?: number;
}

export
interface Octave<P extends any> extends OptOctave<P> {
  func: OctaveFunc<P>;
  min: number;
  length: number;
}

interface Color {
  light: string;
  main: string;
  dark: string;
  contrastText: string;
}

interface Palette {
  colorOct: Octave<string>[],
  common: {
    white: string;
    black: string;
  };
  type: string;
  primary: Color;
  secondary: Color;
  success: Color;
  warning: Color;
  error: Color;
  info: Color;
  divider: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    // icon: string;
  },
  background: {
    paper: string;
    default: string;
  },
  action: {
    hoverOpacity: string;
    active: string;
  };
  grey: string[];
}

export interface Theme {
  palette: Palette;
  spacingOct: OptOctave<string>[];
  typography: {
    htmlFontSize: number;
    fontFamily: string;
    fontSizeOct: OptOctave<string>[],
    h1: Css;
    h2: Css;
    h3: Css;
    h4: Css;
    h5: Css;
    h6: Css;
    subtitle2: Css;
    caption: Css;
    pxToRem: (arg: any) => any;
  };
  breakpoints?: { keys: [], up: (name: string) => string };
  shadows?: [];
  transitions?: { create: (() => void), duration: { shorter: string }, easing: { easeOut: string } };
  shape?: { borderRadius: string };
  zIndex?: { tooltip: number };
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

export type MagicValue = string | number;

export interface MagicTable {
  [key: string]: MagicValue;
}
