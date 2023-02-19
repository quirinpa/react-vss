import React from "react";
import { Theme } from "@material-ui/core";
import { Cast, MagicBook, CastProps, MagicClassesProps, Magic, CastComponentProps } from "./types";

declare function useCast(Context: React.Context<Magic>|null): Cast;
declare function withCast(Com: React.ComponentType<CastProps>): React.FC<CastComponentProps>;
declare function withMagicBook<P extends object>(Com: React.ComponentType<P>): React.FC<P&MagicClassesProps>;
/*
 * for use with withStyles(style)(withMagicClasses(Component)).
 * provides you with the Magic context.
 */
declare function makeMagicClasses(theme: Theme): MagicBook;
declare const MagicBookContext: React.Context<Magic>;
