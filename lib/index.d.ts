import React from "react";
import { Theme, MagicBook, Magic, Dependencies, WithThemeProps } from "./types";

declare function makeMagic(obj: object, reprefix: string): Magic;
declare function makeThemeMagicBook(name: string, theme: Theme): MagicBook;

declare function withMagic(
  Component: React.ComponentType<SimpleThemeProps> ,
  dependencies?: Dependencies,
  context?: boolean,
): React.ComponentType<WithThemeProps>;

declare function getThemeMagic(theme: Theme, getStyle: typeof makeThemeMagicBook): Magic;
declare function getMagicTable(prefix: string, table: MagicTable, property?: string): Magic;
