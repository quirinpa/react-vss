import React, { useState, useEffect, useMemo } from "react";
import { Sub, reflect } from "@tty-pt/sub";
import deepmerge from "deepmerge";

import {
  Theme, Octave, OptOctave, Css, Magic, MagicBook,
  MagicValue, MagicTable, WithThemeProps, WithClassesProps,
} from "./types";

export { Theme } from "./types";

export let magic = {};

export function dashCamelCase(camelCase: string) {
  return camelCase.replace(/([A-Z0-9])+/g, function (g) { return "-" + g.toLowerCase(); })
    .replace(/([0-9][a-z]+)/g, function (g) { return g.substring(0, 1) + "-" + g.substring(1); });
}

export function camelCaseDash(dash: string) {
  return dash.replace(/-([a-zA-Z0-9])+/g, function (g) { return g.substring(1, 2).toUpperCase() + g.substring(2); });
}

const validPropMap : { [key: string]: true } = {
  "align-content": true,
  "align-items": true,
  "align-self": true,
  "all": true,
  "animation": true,
  "animation-delay": true,
  "animation-direction": true,
  "animation-duration": true,
  "animation-fill-mode": true,
  "animation-iteration-count": true,
  "animation-name": true,
  "animation-play-state": true,
  "animation-timing-function": true,
  "backface-visibility": true,
  "background": true,
  "background-attachment": true,
  "background-blend-mode": true,
  "background-clip": true,
  "background-color": true,
  "background-image": true,
  "background-origin": true,
  "background-position": true,
  "background-repeat": true,
  "background-size": true,
  "border": true,
  "border-bottom": true,
  "border-bottom-color": true,
  "border-bottom-left-radius": true,
  "border-bottom-right-radius": true,
  "border-bottom-style": true,
  "border-bottom-width": true,
  "border-collapse": true,
  "border-color": true,
  "border-image": true,
  "border-image-outset": true,
  "border-image-repeat": true,
  "border-image-slice": true,
  "border-image-source": true,
  "border-image-width": true,
  "border-left": true,
  "border-left-color": true,
  "border-left-style": true,
  "border-left-width": true,
  "border-radius": true,
  "border-right": true,
  "border-right-color": true,
  "border-right-style": true,
  "border-right-width": true,
  "border-spacing": true,
  "border-style": true,
  "border-top": true,
  "border-top-color": true,
  "border-top-left-radius": true,
  "border-top-right-radius": true,
  "border-top-style": true,
  "border-top-width": true,
  "border-width": true,
  "bottom": true,
  "box-shadow": true,
  "box-sizing": true,
  "caption-side": true,
  "caret-color": true,
  "clear": true,
  "clip": true,
  "clip-path": true,
  "color": true,
  "column-count": true,
  "column-fill": true,
  "column-gap": true,
  "column-rule": true,
  "column-rule-color": true,
  "column-rule-style": true,
  "column-rule-width": true,
  "column-span": true,
  "column-width": true,
  "columns": true,
  "content": true,
  "counter-increment": true,
  "counter-reset": true,
  "cursor": true,
  "direction": true,
  "display": true,
  "empty-cells": true,
  "filter": true,
  "flex": true,
  "flex-basis": true,
  "flex-direction": true,
  "flex-flow": true,
  "flex-grow": true,
  "flex-shrink": true,
  "flex-wrap": true,
  "float": true,
  "font": true,
  "font-family": true,
  "font-kerning": true,
  "font-size": true,
  "font-size-adjust": true,
  "font-stretch": true,
  "font-style": true,
  "font-variant": true,
  "font-weight": true,
  "grid": true,
  "grid-area": true,
  "grid-auto-columns": true,
  "grid-auto-flow": true,
  "grid-auto-rows": true,
  "grid-column": true,
  "grid-column-end": true,
  "grid-column-gap": true,
  "grid-column-start": true,
  "grid-gap": true,
  "grid-row": true,
  "grid-row-end": true,
  "grid-row-gap": true,
  "grid-row-start": true,
  "grid-template": true,
  "grid-template-areas": true,
  "grid-template-columns": true,
  "grid-template-rows": true,
  "height": true,
  "hyphens": true,
  "justify-content": true,
  "left": true,
  "letter-spacing": true,
  "line-height": true,
  "list-style": true,
  "list-style-image": true,
  "list-style-position": true,
  "list-style-type": true,
  "margin": true,
  "margin-bottom": true,
  "margin-left": true,
  "margin-right": true,
  "margin-top": true,
  "max-height": true,
  "max-width": true,
  "min-height": true,
  "min-width": true,
  "object-fit": true,
  "object-position": true,
  "opacity": true,
  "order": true,
  "outline": true,
  "outline-color": true,
  "outline-offset": true,
  "outline-style": true,
  "outline-width": true,
  "overflow": true,
  "overflow-x": true,
  "overflow-y": true,
  "padding": true,
  "padding-bottom": true,
  "padding-left": true,
  "padding-right": true,
  "padding-top": true,
  "page-break-after": true,
  "page-break-before": true,
  "page-break-inside": true,
  "perspective": true,
  "perspective-origin": true,
  "pointer-events": true,
  "position": true,
  "quotes": true,
  "right": true,
  "scroll-behavior": true,
  "table-layout": true,
  "text-align": true,
  "text-align-last": true,
  "text-decoration": true,
  "text-decoration-color": true,
  "text-decoration-line": true,
  "text-decoration-style": true,
  "text-indent": true,
  "text-justify": true,
  "text-overflow": true,
  "text-shadow": true,
  "text-transform": true,
  "top": true,
  "transform": true,
  "transform-origin": true,
  "transform-style": true,
  "transition": true,
  "transition-delay": true,
  "transition-duration": true,
  "transition-property": true,
  "transition-timing-function": true,
  "user-select": true,
  "vertical-align": true,
  "visibility": true,
  "white-space": true,
  "width": true,
  "word-break": true,
  "word-spacing": true,
  "word-wrap": true,
  "writing-mode": true,
  "z-index": true,
};

function keyConvert(key: string, prefix: string = "") {
  const firstChar = key.charAt(0);
  switch (firstChar) {
  case "?": return key.replaceAll("?", prefix + " ");
  case " ":
  case "&": return key.substring(1);
  case "!": return key.replaceAll("!", prefix + " .");
  default:
    if (prefix && key.substring(0, prefix.length) === prefix)
      return key;
    return prefix + " ." + dashCamelCase(key);
  }
}

function getCssContent(parentKey: string, content: Magic) {
  let ret = "";
  let later = "";

  for (const [key, value] of Object.entries(content[parentKey] ?? {})) {
    if (typeof value === "object") {
      if (key.charAt(0) !== "&" && validPropMap[key])
        continue;
      const reKey = key.replaceAll(/&/g, parentKey);
      ret += getCssContent(reKey, { [reKey]: value });
    } else if (value !== undefined)
      later += dashCamelCase(key) + ": " + value.toString() + ";";
  }

  return ret + (later ? parentKey + " {" + later + "}\n" : "");
}

(window as any).getCssContent = getCssContent;

function cssTransform(content: Css, camelKey: string, value: MagicValue) {
  if (!value)
    return;

  if (!content[camelKey])
    content[camelKey] = {};

  for (const [key, spell] of Object.entries(value)) {
    if (typeof spell !== "object") {
      content[camelKey][key] = spell;
      continue;
    }
    cssTransform(content[camelKey], camelKey + keyConvert(key), spell);
  }
}

export
function makeMagic(obj: MagicBook, prefix: string = "") {
  const style = document.createElement("style");
  let css = "";

  let content = {};

  for (const [key, value] of Object.entries(obj)) {
    const ckey = keyConvert(key, prefix);
    if (magic[ckey])
      continue;
    cssTransform(content, ckey, value);
    css += getCssContent(ckey, content);
  }

  if (!css)
    return;

  style.appendChild(document.createTextNode(css));
  style.type = "text/css";
  document.head.appendChild(style);
}

const horizontal0 = { display: "flex", flexDirection: "initial" };
const vertical0 = { display: "flex", flexDirection: "column" };

export interface MagicAccumulator extends MagicBook {
  magic: MagicValue;
}

function reducer(allMagicTable: MagicTable, prefix: string, propertyArr: string[], a: MagicBook, [key, value]: [string, MagicValue]) {
  if (key === "*") {
    a.magic = value;
    return a;
  }

  const curVal: MagicValue = a[prefix + key];

  for (const prop of propertyArr)
    a[prefix + key] = {
      ...allMagicTable,
      ...(typeof curVal === "object" ? curVal : {}),
      ...(a[prefix + key] as object),
      [prop]: value
    };

  return a;
}


function recurseReducer(allMagicTable: MagicTable, prefix: string, a: MagicBook, [key, value]: [string, MagicTable]): MagicBook {
  const rekey = prefix + (key === "*" ? "" : key);
  a[rekey] = { ...allMagicTable, };

  for (const prop of Object.keys(value)) {
    a[rekey] = {
      ...a[rekey] as MagicBook,
      [prop]: value[prop]
    };
  }

  return a;
}

export
function drawMagicTable(prefix: string, table: MagicTable, property?: string|(string[])): MagicBook {
  if (!table || typeof table !== "object")
    return table;

  const dashPrefix = dashCamelCase(prefix);
  const allMagicTable = table["*"] ?? {};

  if (property === "*")
    return Object.entries(table).reduce(
      recurseReducer.bind(null, allMagicTable, prefix),
      {}
    );

  const realProperty = property ?? dashPrefix;

  return Object.entries(table).reduce(
    reducer.bind(null, allMagicTable, prefix, typeof realProperty === "string" ? [realProperty] : (realProperty === undefined ? [] : realProperty).map(
      prop => prop ?? dashPrefix
    )),
    {}
  );
}

export
const baseMagicBook = {
  horizontal0,
  vertical0,
  relative: { position: "relative !important" },
  absolute: { position: "absolute !important" },
  fixed: { position: "fixed !important" },
  positionTop0: { top: 0 },
  positionBottom0: { bottom: 0 },
  positionLeft0: { left: 0 },
  positionRight0: { right: 0 },
  position0: { top: 0, bottom: 0, left: 0, right: 0 },
  margin0: { margin: 0 },
  marginTop0: { marginTop: 0 },
  marginBottom0: { marginBottom: 0 },
  marginLeft0: { marginLeft: 0 },
  marginRight0: { marginRight: 0 },
  padding0: { padding: 0 },
  paddingTop0: { paddingTop: 0 },
  paddingBottom0: { paddingBottom: 0 },
  paddingLeft0: { paddingLeft: 0 },
  paddingRight0: { paddingRight: 0 },
  ...drawMagicTable("alignSelf", {
    "": "stretch",
    Center: "center",
    End: "flex-end",
    Start: "flex-start",
  }),
  flexGrow: { flexGrow: 1 },
  flexGrowChildren: {
    "& > *": {
      flexGrow: 1,
    },
  },
  /*"?.flex-grow-children > *": {
    flexGrow: 1,
  },*/
  ...drawMagicTable("overflow", {
    "": "auto",
    Hidden: "hidden",
  }),
  ...drawMagicTable("alignItems", {
    "": "center",
    Start: "start",
    End: "end",
  }),
  ...drawMagicTable("justifyContent", {
    "": "center",
    Start: "start",
    SpaceAround: "space-around",
    SpaceBetween: "space-between",
    End: "end",
  }),
  sizeVertical: { height: "100%" },
  minSizeVertical: { minHeight: "100%" },
  sizeVerticalView: { height: "100vh !important" },
  minSizeVerticalView: { minHeight: "100vh" },
  maxSizeVertical: { maxHeight: "100%" },
  sizeHorizontal: { width: "100%" },
  minSizeHorizontal: { minWidth: "100%" },
  maxSizeHorizontal: { maxWidth: "100%" },
  sizeHorizontalHalf: { width: "50%" },
  sizeHorizontalQuarter: { width: "25%" },
  sizeHorizontalThreeFourths: { width: "75%" },
  sizeMaxVertical7Rem: {
    maxHeight: "7rem",
  },
  ...drawMagicTable("textAlign", {
    Left: "left",
    "": "center",
    Right: "right",
  }),
  ...drawMagicTable("cursor", {
    "": "pointer"
  }),
  ...drawMagicTable("cursorHorizontal", {
    "": "ew-resize"
  }, "cursor"),
  ...drawMagicTable("cursorVertical", {
    "": "ns-resize"
  }, "cursor"),
  verticalCenter: {
    display: "inline-flex !important",
    flexDirection: "column",
    justifyContent: "center",
  },
  flexWrap: { flexWrap: "wrap" },
  ...drawMagicTable("tableLayout", {
    "": "fixed",
  }),
  ...drawMagicTable("color", {
    "": "inherit",
    White: "white",
    Black: "black",
  }, ["color", "fill"]),
  ...drawMagicTable("background", {
    "": "inherit",
    White: "white",
    Black: "black",
  }, "background-color"),
  ...drawMagicTable("opacity", {
    Smallest: 0.1,
    Small: 0.3,
    "": 0.5,
    Big: 0.8,
    Biggest: 1,
  }),
  ...drawMagicTable("fontWeight", {
    "": 600,
  }),
  ...drawMagicTable("rotate", {
    "": "rotate(90deg)",
  }, "transform"),
  ...drawMagicTable("textOverflow", {
    "": "ellipsis",
  }),
  ...drawMagicTable("borderCollapse", {
    "": "collapse",
  }),
  ...drawMagicTable("display", {
    "": "inline-block",
    None: "none",
  }),
  ...drawMagicTable("boxSizing", {
    "": "border-box",
  }),
};

makeMagic(baseMagicBook);

let mapByTheme = {
  "": new Map<Function, boolean>(),
};

function octaveDefaults<P extends any>(opt: OptOctave<P>, defaults: Octave<P>) {
  return {
    min: opt.min ?? defaults.min,
    func: opt.func ?? defaults.func,
    length: opt.length ?? defaults.length,
  };
}

function hexRgb(hex: string) {
  // Remove the hash at the start if it's there
  hex = hex.charAt(0) === "#" ? hex.slice(1) : hex;

  // Parse r, g, b values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b];
}

export
function hexToRGBA(hex: string, alpha = 1) {
  const [r, g, b] = hexRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export
function colorMix(color0: string, color1: string, alpha = 1) {
  const [r, g, b] = hexRgb(color0);
  const [r1, g1, b1] = hexRgb(color1);
  const inv = 1 - alpha;

  return `rgb(${r * inv + r1 * alpha}, ${g * inv + g1 * alpha}, ${b * inv + b1 * alpha})`;
}

export function makeThemeMagicBook(theme: Theme, themeName?: string): MagicBook {
  const spacings: OptOctave<any>[] = theme.spacingOct ?? defaultSpacing;
  const fontSizes: OptOctave<any>[] = theme.typography.fontSizeOct ?? defaultFontSize;
  const colors: OptOctave<string>[] = theme.palette.colorOct ?? defaultColor;

  let dynamic = {};

  for (const opt of spacings) {
    const octave = octaveDefaults(opt, defaultSpacingOctave);

    for (let i = octave.min; i < octave.length; i += 1) {
      const [label, value] = (octave.func ?? defaultSpacingFunc)(i);
      dynamic["horizontal" + label] = { ...horizontal0, gap: value };
      dynamic["blockHorizontal" + label] = {
        "& > *": { display: "inline-block" },
        "& > *:not(:first)": { marginLeft: value },
      };
      dynamic["childPadHorizontal" + label] = {
        "& > *": {
          display: "inline-block",
          paddingLeft: "calc(" + value + "/2)",
          paddingRight: "calc(" + value + "/2)",
        },
      };
      dynamic["splitHorizontal2" + label] = { "& > *": { width: "calc(50% - " + value + ")" } };
      dynamic["splitHorizontal3" + label] = { "& > *": { width: "calc(33.33332% - " + value + " * 2)" } };
      dynamic["vertical" + label] = { ...vertical0, rowGap: value };
      dynamic["pad" + label] = { padding: value };
      dynamic["padVertical" + label] = { paddingTop: value, paddingBottom: value };
      dynamic["padHorizontal" + label] = { paddingLeft: value, paddingRight: value };
      dynamic["padTop" + label] = { paddingTop: value };
      dynamic["padBottom" + label] = { paddingBottom: value };
      dynamic["padLeft" + label] = { paddingLeft: value };
      dynamic["padRight" + label] = { paddingRight: value };
      dynamic["padTop" + label + "Neg"] = { paddingBottom: value, paddingLeft: value, paddingRight: value };
      dynamic["padBottom" + label + "Neg"] = { paddingTop: value, paddingLeft: value, paddingRight: value };
      dynamic["padLeft" + label + "Neg"] = { paddingTop: value, paddingBottom: value, paddingRight: value };
      dynamic["padRight" + label + "Neg"] = { paddingTop: value, paddingBottom: value, paddingLeft: value };
      dynamic["tableVertical" + label] = {
        "& th": {
          paddingTop: "calc(" + value + "/2)",
          paddingBottom: "calc(" + value + "/2)",
        },
        "& td": {
          paddingTop: "calc(" + value + "/2)",
          paddingBottom: "calc(" + value + "/2)",
        }
      };
      dynamic["tableHorizontal" + label] = {
        "& th": {
          paddingLeft: "calc(" + value + "/2)",
          paddingRight: "calc(" + value + "/2)",
        },
        "& td": {
          paddingLeft: "calc(" + value + "/2)",
          paddingRight: "calc(" + value + "/2)",
        }
      };
      dynamic["position" + label] = { top: value, bottom: value, left: value, right: value };
      dynamic["positionTop" + label] = { top: value };
      dynamic["positionBottom" + label] = { bottom: value };
      dynamic["positionLeft" + label] = { left: value };
      dynamic["positionRight" + label] = { right: value };
      dynamic["position" + label + "Neg"] = { top: -value, bottom: -value, left: -value, right: -value };
      dynamic["positionTop" + label + "Neg"] = { top: "-" + value };
      dynamic["positionBottom" + label + "Neg"] = { bottom: "-" + value };
      dynamic["positionLeft" + label + "Neg"] = { left: "-" + value };
      dynamic["positionRight" + label + "Neg"] = { right: "-" + value };
      dynamic["margin" + label] = { margin: value };
      dynamic["marginNeg" + label] = { margin: "-" + value };
      dynamic["marginVertical" + label] = { marginTop: value, marginBottom: value };
      dynamic["marginHorizontal" + label] = { marginLeft: value, marginRight: value };
      dynamic["marginVertical" + label + "Neg"] = { marginTop: "-" + value, marginBottom: "-" + value };
      dynamic["marginHorizontal" + label + "Neg"] = { marginLeft: "-" + value, marginRight: "-" + value };
      dynamic["marginTop" + label] = { marginTop: value };
      dynamic["marginTop" + label + "Neg"] = { marginTop: "-" + value };
      dynamic["marginBottom" + label] = { marginBottom: value };
      dynamic["marginLeft" + label] = { marginLeft: value };
      dynamic["marginRight" + label] = { marginRight: value };
      dynamic["borderRadius" + label] = { borderRadius: value };
      dynamic["sizeHorizontal" + (label || "Medium")] = { width: value };
      dynamic["sizeHorizontalView" + (label || "Medium") + "Neg"] = { width: "calc(100vh - 2 * " + value + ")" };
      dynamic["sizeVertical" + (label || "Medium")] = { height: value };
      dynamic["sizeVerticalView" + (label || "Medium") + "Neg"] = { height: "calc(100vh - 2 * " + value + ")" };
      dynamic["minSizeVerticalView" + (label || "Medium") + "Neg"] = { minHeight: "calc(100vh - 2 * " + value + ") !important" };
      dynamic["size" + label] = { width: value, height: value };
    }
  }

  for (const opt of fontSizes) {
    const octave = octaveDefaults(opt, defaultFontSizeOctave);

    for (let i = octave.min; i < octave.length; i += 1) {
      const [label, value] = octave.func(i);
      dynamic["fontSize" + label] = { fontSize: value };
    }
  }

  for (const opt of colors) {
    const octave = octaveDefaults(opt, defaultColorOctave);
    for (let i = octave.min ?? 0; i < octave.length ?? 16; i += 1) {
      const [label, value] = octave.func(i);
      dynamic["color" + label] = { color: value };
      dynamic["background" + label] = { backgroundColor: value };
      dynamic["hover" + label] = { "&:hover": { color: value } };
    }
  }

  const disabledColor = hexToRGBA(theme.palette.text.disabled, 0.5);
  const hoverColor = hexToRGBA(theme.palette.primary.light, 0.3);
  const chipHoverColor = colorMix(theme.palette.background.primary, theme.palette.text.primary, 0.1);
  dynamic["colorDisabled"] = { color: disabledColor };

  return {
    "?body": {
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
      fill: theme.palette.text.primary,
      margin: 0,
    },
    "?.sbdocs,?.sbdocs>*": {
      background: "inherit",
      color: theme.palette.text.primary,
    },
    "!MuiPaper-root": {
      backgroundColor: theme.palette.background.primary,
      color: theme.palette.text.primary,
    },
    "!MuiTableCell-root": {
      borderBottom: "solid thin " + theme.palette.divider,
      color: theme.palette.text.primary,
      backgroundColor: "inherit",
    },
    "!MuiTextField-root,!MuiInput-root,!MuiInputBase-root": {
      "& svg": {
        color: theme.palette.text.primary,
      },
    },
    "!MuiTableSortLabel-root": {
      "!Mui-active,&:hover,&:focus": { color: disabledColor },
      "!Mui-active .MuiSvgIcon-root": { color: theme.palette.text.primary },
    },
    "!MuiCheckbox-root": {
      color: disabledColor + " !important",
    },
    "!MuiToolbar-root": {
      backgroundColor: theme.palette.background.primary,
      color: theme.palette.text.primary + " !important",
    },
    "!MuiButton-root": {
      // backgroundColor: theme.palette.primary.main,
      color: theme.palette.text.primary,
      fill: theme.palette.text.primary,
    },
    "!MuiButton-contained": {
      backgroundColor: theme.palette.background.primary,
    },
    "!MuiButton-root:hover": {
      backgroundColor: chipHoverColor,
    },
    "!MuiIconButton-root": {
      color: theme.palette.primary.main,
      fill: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: hoverColor,
      },
      "& > i": {
        color: theme.palette.primary.main,
        fill: theme.palette.primary.main,
      }
    },
    // "!MuiButtonBase-root,!MuiSvgIcon-root": {
    //   color: "inherit",
    // },
    "!MuiCheckbox-root.Mui-checked .MuiSvgIcon-root": {
      color: theme.palette.primary.main,
    },
    "!MuiSwitch-colorPrimary.Mui-checked:hover": {
      backgroundColor: hoverColor,
    },
    "!MuiInput-underline": {
      "&:before,&:after": {
        borderBottom: "solid 1px " + disabledColor,
      },
    },
    "!MuiOutlinedInput-notchedOutline": {
      border: "solid 1px " + disabledColor,
    },
    "!MuiOutlinedInput-root:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
      border: "solid 1px " + theme.palette.text.primary,
    },
    "!MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "solid 1px " + theme.palette.primary.main,
    },
    "!MuiInput-underline:hover:not(.Mui-focused)": {
      "&:before,&:after": {
        borderBottom: "solid 2px " + theme.palette.text.primary,
      },
    },
    "!MuiInput-underline.Mui-focused": {
      "&:before": {
        borderBottom: "solid 2px " + theme.palette.text.primary,
      },
      "&:after": {
        borderBottom: "solid 2px " + theme.palette.primary.main,
      },
    },
    "!MuiButton-root .MuiSvgIcon-root": {
      color: "inherit",
    },
    "!MuiFab-root,!MuiFab-root:hover": {
      backgroundColor: theme.palette.primary.main,
    },
    "!MuiFormHelperText-root": {
      color: theme.palette.text.primary,
      marginTop: 0,
    },
    "!MuiIconButton-root.Mui-disabled": {
      color: disabledColor + " !important",
      fill: disabledColor,
    },
    // "?svg, ?i": {
    //   color: "inherit",
    //   fill: "inherit",
    // },
    "?svg.active, ?i.active, ?.icon-selected": {
      color: theme.palette.primary.main,
      fill: theme.palette.primary.main,
    },
    // "!MuiIconButton-root:not(:disabled)": {
    //   color: theme.palette.primary.main,
    //   fill: theme.palette.primary.main,
    //   "& > svg, & > i": {
    //     color: theme.palette.primary.main,
    //     fill: theme.palette.primary.main,
    //   },
    // },
    // "!MuiSvgIcon-root": {
    //   color: theme.palette.text.primary + " !important",
    //   fill: theme.palette.text.primary + " !important"
    // },
    "!MuiChip-root": {
      color: theme.palette.primary.main + " !important",
      fill: theme.palette.primary.main + " !important",
      backgroundColor: theme.palette.background.primary,
      "&:hover": {
        backgroundColor: chipHoverColor,
      },
    },
    "!MuiInputBase-input": {
      color: "inherit",
    },
    "!MuiFormLabel-root": {
      color: theme.palette.text.primary,
    },
    "!MuiInputBase-root": {
      color: theme.palette.text.primary + " !important",
      fill: theme.palette.text.primary + " !important",
    },
    "!MuiIconBase-root": {
      color: "inherit",
      fill: "inherit",
    },
    "?button:disabled": {
      "& > i, & > svg": {
        color: disabledColor,
        fill: disabledColor,
      },
    },
    // "?svg": {
    //   fill: theme.palette.text.primary,
    // },
    "!MuiFormLabel-colorPrimary": {
      color: theme.palette.text.primary,
      fill: theme.palette.text.primary,
    },
    "!MuiDayCalendar-weekDayLabel": {
      color: disabledColor,
    },
    "!MuiPickersDay-today:not(.Mui-selected)": {
      borderColor: disabledColor,
    },
    menuItem: {
      ...baseMagicBook.vertical0,
      padding: "8px",
    },
    paper: {
      backgroundColor: theme.palette.background.primary,
      color: theme.palette.text.primary,
      fill: theme.palette.text.primary,
    },
    ...dynamic,
    caption: theme.typography.caption,
    h3: theme.typography.h3,
    h4: theme.typography.h4,
    h5: theme.typography.h5,
    h6: theme.typography.h6,
    subtitle2: theme.typography.subtitle2,
    hoverInfo: {
      "&:hover": {
        color: theme.palette.info.main + " !important"
      },
    },
    hoverSuccess: {
      "&:hover": {
        color: theme.palette.success.main + " !important"
      },
    },
    ...drawMagicTable("color", {
      "": theme.palette.text.primary + " !important",
      Primary: theme.palette.primary.main + " !important",
      Secondary: theme.palette.text.secondary + " !important",
      Success: theme.palette.success.main + "!important",
      SucessLight: theme.palette.success.light + "!important",
      Warning: theme.palette.warning.main + "!important",
      WarningLight: theme.palette.warning.light + "!important",
      "Error": theme.palette.error.main + "!important",
      ErrorLight: theme.palette.error.light + "!important",
      ErrorDark: theme.palette.error.dark + "!important",
      "Info": theme.palette.info.main + "!important",
      InfoLight: theme.palette.info.light + "!important",
    }, ["color", "fill"]),
    ...drawMagicTable("background", {
      "": theme.palette.background.primary,
      Body: theme.palette.background.default,
      Success: theme.palette.success.main,
      SuccessLight: theme.palette.success.light,
      Warning: theme.palette.warning.main,
      WarningLight: theme.palette.warning.light,
      "Error": theme.palette.error.main,
      ErrorLight: theme.palette.error.light,
      ErrorDark: theme.palette.error.dark,
      "Info": theme.palette.info.main,
      InfoLight: theme.palette.info.light,
    }, "background-color"),
    border: {
      border: "solid thin " + theme.palette.divider,
    },
    borderTop: {
      borderTop: "solid thin " + theme.palette.divider,
    },
    borderBottom: {
      borderBottom: "solid thin " + theme.palette.divider,
    },
    borderLeft: {
      borderLeft: "solid thin " + theme.palette.divider,
    },
    borderRight: {
      borderRight: "solid thin " + theme.palette.divider,
    },
    "!MuiDivider-root": {
      borderColor: theme.palette.divider,
    },
    ...drawMagicTable("textTransform", {
      "": "uppercase",
    }),
    ...drawMagicTable("textDecoration", {
      "": "none",
    }),
  };
}

let themeCache = {};

const spacingsTable: [string, string][] = [
  ["Smallest", "4px"],
  ["Small", "8px"],
  ["MediumSmall", "12px"],
  ["", "16px"],
  ["Medium", "24px"],
  ["Big", "32px"],
  ["Biggest", "64px"],
  ["Giant", "128px"],
];

const defaultSpacingFunc = (a: number) => spacingsTable[a];

const defaultSpacingOctave: Octave<string> = {
  func: defaultSpacingFunc,
  min: 0,
  length: spacingsTable.length,
};

const defaultSpacing = [defaultSpacingOctave] as [Octave<string>, ...Octave<string>[]];

const defaultFontSizeTable: [number, string][] = [
  [9, "9px"],
  [11, "11px"],
  [14, "14px"],
  [17, "17px"],
  [20, "20px"],
  [26, "26px"],
  [33, "33px"],
  [42, "42px"],
  [54, "54px"],
  [69, "69px"],
  [89, "89px"],
  [111, "111px"],
  [138, "138px"],
];

function defaultFontSizeFunc(x: number): [number, string] {
  return defaultFontSizeTable[x];
}

const defaultFontSizeOctave: Octave<string> = {
  func: defaultFontSizeFunc,
  min: 0,
  length: defaultFontSizeTable.length,
};

const defaultFontSize = [defaultFontSizeOctave] as [Octave<string>, ...Octave<string>[]];

const defaultColorTable: [number, string][] = [
  [0, "#2c2c2c"],  // black
  [1, "#bd4a6a"],  // dark red
  [2, "#3a5e46"],  // dark green
  [3, "#a3975a"],  // dark yellow
  [4, "#7389bd"],  // dark blue
  [5, "#8a77ac"],  // dark magenta
  [6, "#415c5f"],  // dark cyan
  [7, "#8b85a5"],  // dark gray
  [8, "#b4aac1"],  // light gray
  [9, "#bd4a87"],  // red
  [10, "#53d38a"], // green
  [11, "#b8cd2e"], // yellow
  [12, "#739cbd"], // blue
  [13, "#9589c5"], // magenta
  [14, "#16d0ba"], // cyan
  [15, "#f5f5f5"], // white
];

function defaultColorFunc(x: number): [number, string] {
  return defaultColorTable[x];
}

const defaultColorOctave: Octave<string> = {
  func: defaultColorFunc,
  min: 0,
  length: defaultFontSizeTable.length,
};

const defaultColor = [];

export
const defaultTheme: Theme = {
  palette: {
    type: "light",
    colorOct: defaultColor,
    primary: {
      light: "#42a5f5",
      main: "#1976d2",
      dark: "#1565c0",
      contrastText: "rgba(0, 0, 0, 0.87)"
    },
    secondary: {
      light: "#ba68c8",
      main: "#9c27b0",
      dark: "#7b1fa2",
      contrastText: "#fff"
    },
    error: {
      light: "#ef5350",
      main: "#d32f2f",
      dark: "#c62828",
      contrastText: "#fff"
    },
    warning: {
      light: "#ff9800",
      main: "#ed6c02",
      dark: "#e65100",
      contrastText: "rgba(0, 0, 0, 0.87)"
    },
    info: {
      light: "#03a9f4",
      main: "#0288d1",
      dark: "#01579b",
      contrastText: "#fff"
    },
    success: {
      light: "#4caf50",
      main: "#2e7d32",
      dark: "#1b5e20",
      contrastText: "rgba(0, 0, 0, 0.87)"
    },
    divider: "rgba(255, 255, 255, 0.12)",
    text: {
      primary: "#fff",
      secondary: "rgba(255, 255, 255, 0.7)",
      disabled: "#000000",
      // hint: "rgba(255, 255, 255, 0.5)",
      // icon: "rgba(255, 255, 255, 0.5)"
    },
    background: {
      primary: "#d2d2d2",
      default: "#303030",
      // secondary: "#212121"
    },
    action: {
      hoverOpacity: 0.8,
      active: "#ffaa00",
    },
    common: {
      white: "#ffffff",
      black: "#000000",
    },
    // grey: (new Array(1000)).fill("#aaa"),
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: "Open Sans",
    fontSizeOct: defaultFontSize,
    h1: {
      fontFamily: "Open Sans",
      fontSize: "6rem",
      fontWeight: 300
    },
    h2: {
      fontFamily: "Open Sans",
      fontSize: "3.75rem",
      lineHeight: 1.2,
      fontWeight: 300
    },
    h3: {
      fontFamily: "Open Sans",
      fontSize: "3rem",
      fontWeight: 400,
      lineHeight: 1.167
    },
    h4: {
      fontFamily: "Open Sans",
      fontSize: "2.125rem",
      fontWeight: 400,
      lineHeight: 1.235
    },
    h5: {
      fontFamily: "Open Sans",
      fontSize: "1.5rem",
      fontWeight: 400,
      lineHeight: 1.334
    },
    h6: {
      fontFamily: "Open Sans",
      fontWeight: 500,
      fontSize: "1.25rem",
      lineHeight: 1.6,
    },
    // subtitle1: {
    //   fontSize: "1rem",
    //   lineHeight: 1.75
    // },
    subtitle2: {
      fontFamily: "Open Sans",
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: 1.57
    },
    // body1: {
    //   fontFamily: "Roboto",
    //   fontSize: "1rem",
    //   lineHeight: 1.5
    // },
    // body2: {
    //   fontFamily: "Open Sans",
    //   fontWeight: 400,
    //   fontSize: "0.875rem",
    //   lineHeight: 1.43
    // },
    // button: {
    //   fontWeight: 500,
    //   fontSize: "0.875rem",
    //   lineHeight: 1.75,
    //   textTransform: "uppercase"
    // },
    caption: {
      fontFamily: "Open Sans",
      fontWeight: 400,
      fontSize: "0.75rem",
      lineHeight: 1.66
    },
    // overline: {
    //   fontFamily: "Open Sans",
    //   fontWeight: 400,
    //   fontSize: "0.75rem",
    //   lineHeight: 2.66,
    //   textTransform: "uppercase"
    // }
    // pxToRem: (pxValue: number) => {
    //   const baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    //   return `${pxValue / baseFontSize}rem`;
    // },
  },
  spacingOct: defaultSpacing,
  spacing: (...args: number[]) => args.map(nu => (nu * 8) + "px").join(" "),
  // breakpoints: { keys: [], up: a => a },
  // shadows: [],
  // transitions: { create: () => {}, duration: { shorter: "" }, easing: { easeOut: "" } },
  // shape: { borderRadius: 2 },
  // zIndex: {
  // tooltip: 10,
  // },
};

interface ThemeSubInterface {
  name: string;
  themes: {
    [key: string]: Theme;
  }
};

class ThemeSub extends Sub<ThemeSubInterface> {
  constructor() {
    super({
      name: window.localStorage.getItem("@tty-pt/styles/theme") ?? "light",
      themes: {
        light: defaultTheme,
      },
    });
  }

  @reflect()
  set name(val: string) {
    this._target = val;
  }

  @reflect("themes")
  add(themes: { [key: string]: Theme } | Function) {
    const current = this.get();

    if (typeof themes === "function")
      themes = themes(current.themes);

    let ret = {};

    for (const [themeName, themeContent] of Object.entries(themes))
      ret[themeName] = deepmerge((current.themes ?? {})[themeName] ?? defaultTheme, themeContent);

    const newThemes = deepmerge(current.themes ?? {}, ret);

    return newThemes;
  }

  @reflect("themes")
  create(createTheme: (theme?: Theme) => Theme) {
    const themes = this.get();
    let ret = {};

    for (const [key, value] of Object.entries(themes))
      ret[key] = createTheme(value as Theme);

    return ret;
  }
}

export
const themeSub = new ThemeSub();
globalThis.theme = themeSub;

(document.body.parentElement as HTMLElement).className = themeSub._value.name;

export function getTheme(themeName: string) {
  return themeSub._value.themes[themeName];
}

export
function merge(obj: Record<string, { [key: string]: unknown }>) {
  const ret: Record<string, unknown> = {};

  for (const value of Object.values(obj))
    for (const [subKey, subValue] of Object.entries(value as object))
      ret[subKey] = subValue;

  return ret;
}

export function defaultGetTheme(name: string) {
  return themeCache[name];
}

function _mapClassNames2(ret: { [key: string]: string }, obj: object) {
  obj = obj ?? {};
  for (const key of Object.keys(obj)) {
    const ch = key.charAt(0);
    switch (ch) {
    case "?":
    case "&":
    case "!":
      _mapClassNames2(ret, obj[key]);
      continue;
    }
    if (typeof obj[key] !== "object")
      continue;
    ret[key] = dashCamelCase(key);
    _mapClassNames2(ret, obj[key]);
  }
}

function mapClassNames(obj: object) {
  let ret = {};
  _mapClassNames2(ret, obj);
  return ret;
}

export function getThemeMagic(themeName: string, theme: Theme, getStyle: typeof makeThemeMagicBook, addPrefix: string = "") {
  const map = mapByTheme[themeName];

  if (map && map.has(getStyle))
    return magic;

  const styles = (getStyle ?? makeThemeMagicBook)(theme, themeName);
  const restyles = addPrefix ? { [addPrefix]: styles } : styles;
  const classNames = mapClassNames(restyles);

  makeMagic(
    restyles,
    (themeName ? "." + themeName : ""),
  );

  if (!mapByTheme[themeName]) {
    mapByTheme[themeName] = new Map<Function, true>();
    themeCache[themeName] = theme;
  }

  mapByTheme[themeName].set(getStyle, true);
  return classNames;
}

export
function useThemeName() {
  return themeSub.use().name;
}

export function useTheme() {
  const { name, themes } = themeSub.use();
  return themes[name];
}

interface MagicBoxProps extends WithThemeProps {
  theme?: string;
  getStyle?: typeof makeThemeMagicBook;
  Component: React.ComponentType<WithThemeProps>;
}

export function MagicBox(props: MagicBoxProps) {
  const { Component, getStyle, ...rest } = props;
  const themeName = useThemeName();
  const theme = useTheme();
  getThemeMagic(themeName ?? "", theme, getStyle ?? makeThemeMagicBook);
  return <Component { ...rest } />;
}

// export this if you need to - to avoid problems with dependency duplication
// when you have multiple versions of this lib in your node_modules
export function withMagic<T>(
  Component: React.ComponentType<T&WithThemeProps> | React.ComponentClass<T&WithThemeProps>,
  getStyle?: typeof makeThemeMagicBook,
): React.ComponentType<T&WithThemeProps>{
  return function WithMagicBox(props: WithThemeProps) {
    const { theme, ...rest } = props;

    return (<MagicBox
      Component={Component}
      theme={theme}
      getStyle={getStyle}
      { ...rest }
    />);
  };
}

export function useMagic(getStyle?: typeof makeThemeMagicBook, addPrefix?: any) {
  const theme = useTheme();
  const themeName = useThemeName();
  return useMemo(() => getThemeMagic(themeName, theme, getStyle ?? makeThemeMagicBook, addPrefix), [getStyle, addPrefix]);
}

export function bindMagic(getStyle?: typeof makeThemeMagicBook, addPrefix: string = "") {
  return () => useMagic(getStyle, addPrefix);
}

export const makeStyles = bindMagic;

export function withStyles<T>(getStyle?: typeof makeThemeMagicBook, addPrefix: string = "") {
  const getStyles = bindMagic(getStyle, addPrefix);

  return function realWithStyles(Component: React.ComponentType<T&WithClassesProps> | React.ComponentClass<T&WithClassesProps>) {
    return function WithClasses(props: T) {
      const mag = getStyles();
      return <Component classes={mag} { ...props } />;
    };
  };
}

const responsiveCache = {};

export function
makeResponsive(el: HTMLElement, name: string, S: number, Sp: number, Op: number, max: number = 4) {
  const capiName = name.substring(0, 1).toUpperCase() + name.substring(1);
  let width: number;
  const subs: Map<Function, true> = new Map<Function, true>();

  function outputSize() {
    width = el.clientWidth;
    const W = width - Op;
    // the following line had some help from chat GPT
    const N = Math.min(max, Math.floor((W + Sp) / (S + Sp)));

    if (!responsiveCache[N]) {
      const size = N * S + (N - 1) * Sp;

      makeMagic({
        ["sizeHorizontal" + N + capiName]: {
          width: size + "px !important",
        },
      });
    }

    const cls = "size-horizontal-" + N + "-" + name;

    for (const [sub] of subs)
      sub(cls);

    return responsiveCache[N] = cls;
  }

  function subscribe(sub: React.Dispatch<React.SetStateAction<string>>) {
    subs.set(sub, true);

    return () => {
      subs.delete(sub);
    };
  }

  const cls = outputSize();
  new ResizeObserver(outputSize).observe(el);

  return () => {
    const [responsive, setResponsive] = useState(cls);
    useEffect(subscribe(setResponsive), [setResponsive]);
    return responsive;
  };
}
