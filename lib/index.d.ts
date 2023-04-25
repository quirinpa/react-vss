import React from "react";
import { Theme } from "@material-ui/core";
import { Cast, MagicBook, CastProps, MagicClassesProps, Magic, CastComponentProps, Dependencies, WithThemeProps } from "./types";

declare function makeThemeMagicBook(theme: Theme): MagicBook;
declare function useCast(Context: React.Context<Magic>|null): Cast;
declare function withCast(Com: React.ComponentType<CastProps>): React.FC<CastComponentProps>;
/*
 * for use with withStyles(style)(withMagicClasses(Component)).
 * provides you with the Magic context.
 */
declare function withMagicClasses<P extends object>(
  Com: React.ComponentType<P>,
  Context?: React.Context<Magic>,
): React.FC<P&MagicClassesProps>;

declare function withMagic(
  Component: React.ComponentType<object>,
  getStyle?: typeof makeThemeMagicBook,
  dependencies?: Dependencies,
): React.FC<WithThemeProps>;

declare const MagicContext: React.Context<Magic>;
