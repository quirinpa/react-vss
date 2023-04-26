import React from "react";
import { Theme, MagicBook, Magic, WithThemeProps, WithClassesProps } from "./types";

declare const baseMagicBook: MagicBook;

// add css classNames that are based on the configuration object obj
declare function makeMagic(obj: object, reprefix?: string): Magic;

// argument for makeStyles and others. aka getStyle.
declare function makeThemeMagicBook(theme: Theme, name: string): MagicBook;

// add magic to your app
declare function withMagic(
  Component: React.ComponentType<WithThemeProps> ,
  getStyle?: typeof makeThemeMagicBook,
): React.ComponentType<WithThemeProps>;

// almost drop-in replacement form MUI v4 makeStyles
declare function bindMagic(getStyle?: typeof makeThemeMagicBook, reprefix: string): Magic;

declare function registerGetTheme(argGetTheme: () => string): void;

declare function themeSubscribe(setTheme: (name: string) => void): () => {};

// get current Theme (name)
declare function useTheme(): string;

// used to generate MagicBook contents more easily
declare function getMagicTable(prefix: string, table: MagicTable, property?: string): MagicBook;

declare function withStyles(
  Component: React.ComponentType<WithClassesProps>,
): React.ComponentType;

declare const defaultTheme: Theme;
