import React from "react";
import { Theme } from "@material-ui/core";
import { Cast, MagicBook, CastProps, MagicBookProps } from "./types";

declare function useCast(): Cast;
declare function withCast(Com: React.ComponentType<CastProps>): React.FC<object>;
declare function withMagicBook<P extends object>(Com: React.ComponentType<P>): React.FC<P&MagicBookProps>;
declare function makeMagicBook(theme: Theme): MagicBook;
