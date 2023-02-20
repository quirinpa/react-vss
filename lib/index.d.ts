import React from "react";
import { Theme } from "@material-ui/core";
import { Cast, MagicBook, CastProps, MagicClassesProps, Magic, CastComponentProps } from "./types";

declare function makeMagicBook(theme: Theme): MagicBook;
declare function useCast(Context: React.Context<Magic>|null): Cast;
declare function withCast(Com: React.ComponentType<CastProps>): React.FC<CastComponentProps>;
/*
 * for use with withStyles(style)(withMagicClasses(Component)).
 * provides you with the Magic context.
 */
declare function withMagicClasses<P extends object>(Com: React.ComponentType<P>): React.FC<P&MagicClassesProps>;
declare const MagicBookContext: React.Context<Magic>;
