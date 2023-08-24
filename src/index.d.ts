import React from "react";
import { Theme, MagicBook, MagicTable, Magic, WithThemeProps, WithClassesProps, ThemeSub } from "./types";
import { Sub } from "@tty-pt/sub/dist/types";

declare const baseMagicBook: MagicBook;

// add css classNames that are based on the configuration object obj
declare function makeMagic(obj: MagicBook, reprefix?: string): Magic;

// argument for makeStyles and others. aka getStyle.
declare function makeThemeMagicBook(theme: Theme, name: string): MagicBook;

declare function defaultGetTheme<P extends Theme>(
  name: string
): P;

// add magic to your app
declare function withMagic(
  Component: React.ComponentType<WithThemeProps> ,
  getStyle?: typeof makeThemeMagicBook,
): React.ComponentType<WithThemeProps>;

// almost drop-in replacement form MUI v4 makeStyles
declare function bindMagic(getStyle?: typeof makeThemeMagicBook, reprefix?: string): () => Magic;

export function useMagic(getStyle?: typeof makeThemeMagicBook, addPrefix?: any): Magic;

// get current Theme (name)
declare function useTheme(): Theme;
declare function useThemeName(): string;

// used to generate MagicBook contents more easily
declare function drawMagicTable(prefix: string, table: MagicTable, property?: string): MagicBook;

declare function withStyles(
  Component: React.ComponentType<WithClassesProps>,
): React.ComponentType;

declare const defaultTheme: Theme;

declare const themeSub: Sub<ThemeSub>;
declare const setTheme: (name: string) => void;

declare function createThemes(createTheme: (theme: Theme) => Theme): void;
