import React from "react";
import { Theme, MagicBook, MagicTable, Magic, WithThemeProps, WithClassesProps } from "./types";
export { Theme } from "./types";
import { Sub } from "@tty-pt/sub";

export declare const baseMagicBook: MagicBook;

// add css classNames that are based on the configuration object obj
export declare function makeMagic(obj: MagicBook, reprefix?: string): Magic;

// argument for makeStyles and others. aka getStyle.
export declare function makeThemeMagicBook(theme: Theme, name: string): MagicBook;

export declare function defaultGetTheme<P extends Theme>(
  name: string
): P;

// add magic to your app
export declare function withMagic(
  Component: React.ComponentType<WithThemeProps> ,
  getStyle?: typeof makeThemeMagicBook,
): React.ComponentType<WithThemeProps>;

// almost drop-in replacement form MUI v4 makeStyles
export declare function bindMagic(getStyle?: typeof makeThemeMagicBook, reprefix?: string): () => Magic;

export function useMagic(getStyle?: typeof makeThemeMagicBook, addPrefix?: any): Magic;

// get current Theme (name)
export declare function useTheme(): Theme;
export declare function useThemeName(): string;

// used to generate MagicBook contents more easily
export declare function drawMagicTable(prefix: string, table: MagicTable, property?: string): MagicBook;

export declare function withStyles(
  Component: React.ComponentType<WithClassesProps>,
): React.ComponentType;

export declare const defaultTheme: Theme;

export declare const themeSub: typeof Sub;
export declare const setTheme: (name: string) => void;

export declare function createThemes(createTheme: (theme: Theme) => Theme): void;
