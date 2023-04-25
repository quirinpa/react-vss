import React from "react";
import { Theme, MagicBook, MagicBag, Magic, Dependencies, WithThemeProps } from "./types";

declare function makeMagic(obj: object, reprefix: string): Magic;
declare function makeThemeMagicBook(name: string, theme: Theme): MagicBook;

declare function withMagic(
  Component: React.ComponentType<SimpleThemeProps> ,
  dependencies?: Dependencies,
  context?: boolean,
): React.ComponentType<WithThemeProps>;

declare const MagicContext: React.Context<Magic>;
declare const defaultMagicBag: MagicBag;

declare function getThemeMagic(theme: Theme, getStyle: typeof makeThemeMagicBook): Magic;
