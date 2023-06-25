import React, { useState, useEffect, useMemo } from "react";

import {
  Theme, Octave, OptOctave, Css, Magic, MagicBook, MagicValue, MagicTable,
  WithThemeProps, WithClassesProps,
} from "./types.ts";

const debug = false;
export let magic = {};

function echo(msg: string, value: unknown) {
  if (debug)
    console.log(msg, value);

  return value;
}

export function dashCamelCase(camelCase: string) {
  return camelCase.replace(/([A-Z0-9])+/g, function (g) { return "-" + g.toLowerCase(); })
    .replace(/([0-9][a-z]+)/g, function (g) { return g.substring(0, 1) + "-" + g.substring(1); });
}

export function camelCaseDash(dash: string) {
  return dash.replace(/-([a-zA-Z0-9])+/g, function (g) { return g.substring(1, 2).toUpperCase() + g.substring(2); });
}

function keyConvert(key: string, prefix: string = "") {
  const firstChar = key.charAt(0);
  switch (firstChar) {
    case '?': return key.replaceAll("?", prefix + " ");
    case ' ':
    case '&': return key;
    case '!': return key.replaceAll("!", prefix + " .");
    default:
      if (prefix && key.substring(0, prefix.length) === prefix)
        return key;
      return prefix + " ." + dashCamelCase(key);
  }
}

function getCssContent(prefix: string, parentKey: string, content: Magic) {
  {/* console.log("getCssContent", prefix, " - ", parentKey, content); */}
  let ret = "";
  let later = "";
  let realKey = keyConvert(parentKey, prefix);

  for (const [key, value] of Object.entries(content[parentKey] ?? {})) {
    if (typeof value === "object") {
       if (key.charAt(0) !== "&")
         continue;
       const reKey = key.replaceAll(/&/g, realKey);
       ret += getCssContent(prefix, reKey, { [reKey]: value });
    } else if (value !== undefined)
       later += dashCamelCase(key) + ": " + value.toString() + ";";
  }

  if (prefix && parentKey.substring(0, prefix.length) === prefix)
    return ret + (later ? parentKey + " {" + later + "}\n" : "");

  return ret + (later ? realKey + " {" + later + "}\n" : "");
}

window.getCssContent = getCssContent;

function cssTransform(content: Css, camelKey: string, value: Css, reprefix = "") {
  {/* echo("cssTransform", [dashKey]); */}
  if (!value)
    return;

  if (!content[camelKey])
    content[camelKey] = {};

  for (const [key, spell] of Object.entries(value)) {
    if (typeof spell !== "object") {
      content[camelKey][key] = spell;
      continue;
    }
    cssTransform(content[camelKey], keyConvert(key), spell, reprefix);
  }
}

export
function makeMagic(obj: Record<string, MagicValue>, prefix?: string) {
  const reprefix = prefix ?? "";
  const style = document.createElement("style");
  let css = "";

  let content = {};

  for (const [key, value] of Object.entries(obj)) {
    const ckey = keyConvert(key, reprefix);
    if (magic[ckey])
      continue;
    cssTransform(content, ckey, value, reprefix);
    css += getCssContent(reprefix, ckey, content);
  }

  if (!css)
    return content;

  echo("ADD STYLE\n", css);
  style.appendChild(document.createTextNode(css));
  style.type = "text/css";
  document.head.appendChild(style);
  return content;
}

const horizontal0 = { display: "flex", flexDirection: "initial" };
const vertical0 = { display: "flex", flexDirection: "column" };

function reducer(allMagicTable: MagicTable, prefix: string, propertyArr: string[], a: MagicBook, [key, value]: [string, MagicValue]) {
  if (key === "*") {
    a.magic = value;
    return a;
  }

  for (const prop of propertyArr)
    a[prefix + key] = {
      ...allMagicTable,
      ...(a[prefix + key] ?? {}),
      [prop]: value
    };

  return a;
}

function recurseReducer(allMagicTable: MagicTable, prefix: string, a: MagicBook, [key, value]: [string, MagicValue]): MagicBook {
  if (key !== "*")
    a[prefix + key] = { ...allMagicTable, ...drawMagicTable(prefix, value, "*") };

  return a;
}

export
function drawMagicTable(prefix: string, table: MagicTable, property?: string|(string[])) {
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

  return echo("drawMagicTable", Object.entries(table).reduce(
    reducer.bind(null, allMagicTable, prefix, typeof realProperty === "string" ? [realProperty] : (realProperty === undefined ? [] : realProperty).map(
      prop => prop ?? dashPrefix
    )),
    {}
  ));
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
  sizeVerticalView: { height: "100vh" },
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

const baseMagic = makeMagic(baseMagicBook);

let magicByTheme = {
  "": baseMagic,
};

let mapByTheme = {
  "": new Map<Function, true>(),
};

magic = merge(magicByTheme);

function octaveDefaults<P extends any>(opt: OptOctave<P>, defaults: Octave<P>) {
  return {
    min: opt.min ?? defaults.min,
    func: opt.func ?? defaults.func,
    length: opt.length ?? defaults.length,
  }
}

export function makeThemeMagicBook(theme: Theme, themeName: string): MagicBook {
  const spacings: OptOctave<any>[] = theme.spacingOct ?? defaultSpacing;
  const fontSizes: OptOctave<any>[] = theme.typography.fontSize ?? defaultFontSize;
  const colors: OptOctave<string>[] = theme.palette.color ?? defaultColor;
  echo("makeThemeMagicBook", [theme, themeName]);

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

  const disabledColor = ("color-mix(in srgb, "
    + theme.palette.text.primary
    + ", transparent 70%)"
  );

  return {
    "!MuiPaper-root": {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    "!MuiTableCell-root": {
      borderBottom: "solid thin " + theme.palette.divider,
      color: theme.palette.text.primary,
    },
    "!MuiTextField-root,!MuiInput-root,!MuiInputBase-root": {
      "& svg": {
        color: theme.palette.text.primary,
      },
    },
    "!MuiTableSortLabel-root": {
      "&.Mui-active,&:hover,&focus": { color: disabledColor },
      "&.Mui-active .MuiSvgIcon-root": { color: theme.palette.text.primary },
    },
    "!MuiCheckbox-root": {
      color: disabledColor + " !important",
    },
    "!MuiToolbar-root": {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    "!MuiButton-root": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      fill: "white",
    },
    "!MuiButton-root:hover": {
      backgroundColor: theme.palette.primary.main,
    },
    "!MuiButtonBase-root,!MuiSvgIcon-root": {
      color: "inherit",
    },
    "!MuiCheckbox-root.Mui-checked .MuiSvgIcon-root": {
      color: theme.palette.primary.main,
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
      color: "rgba(255, 255, 255, 0.3)",
      fill: "rgba(255, 255, 255, 0.3)",
    },
    "?svg.active, ?i.active": {
      color: theme.palette.primary.main,
      fill: theme.palette.primary.main,
    },
    "!MuiIconButton-root:not(:disabled)": {
      color: theme.palette.primary.main,
      fill: theme.palette.primary.main,
      "& > svg, & > i": {
        color: theme.palette.primary.main,
        fill: theme.palette.primary.main,
      },
    },
    // "!MuiSvgIcon-root": {
    //   color: theme.palette.text.primary + " !important",
    //   fill: theme.palette.text.primary + " !important"
    // },
    "!MuiChip-root": {
      color: theme.palette.primary.main + " !important",
      fill: theme.palette.primary.main + " !important",
    },
    "!MuiInputBase-root": {
      color: theme.palette.text.primary + " !important",
      fill: theme.palette.text.primary + " !important",
    },
    "?body": {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      fill: theme.palette.text.primary,
    },
    "?button": {
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
      backgroundColor: theme.palette.background.paper,
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
      "Info": theme.palette.info.main + "!important",
      InfoLight: theme.palette.info.light + "!important",
    }, ["color", "fill"]),
    ...drawMagicTable("background", {
      "": theme.palette.background.paper,
      Body: theme.palette.background.default,
      Success: theme.palette.success.main,
      SuccessLight: theme.palette.success.light,
      Warning: theme.palette.warning.main,
      WarningLight: theme.palette.warning.light,
      "Error": theme.palette.error.main,
      ErrorLight: theme.palette.error.light,
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
    color: defaultColor,
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
      // disabled: "rgba(255, 255, 255, 0.5)",
      // hint: "rgba(255, 255, 255, 0.5)",
      // icon: "rgba(255, 255, 255, 0.5)"
    },
    background: {
      paper: "#d2d2d2",
      default: "#303030",
      // primary: "#424242",
      // secondary: "#212121"
    },
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: "Open Sans",
    fontSize: defaultFontSize,
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
  },
  spacingOct: defaultSpacing,
};

themeCache[""] = defaultTheme;

export
function merge(obj: Record<string, unknown>) {
  const ret: Record<string, unknown> = {};

  for (const value of Object.values(obj))
    for (const [subKey, subValue] of Object.entries(value))
      ret[subKey] = subValue;

  return ret;
}

export
function cast(phrase : string): string {
  return phrase.split(" ").map(camelCaseDash).join(" ");
}

export function defaultGetTheme(name: string) {
  return themeCache[name];
}

let getTheme = defaultGetTheme;

export function registerGetTheme(argGetTheme: typeof defaultGetTheme) {
  getTheme = argGetTheme;
}

export function getThemeMagic(themeName: string, getStyle: typeof makeThemeMagicBook, addPrefix: string = "") {
  const map = mapByTheme[themeName];

  if (map && map.has(getStyle))
    return magic;

  const theme = getTheme(themeName) ?? defaultTheme;

  magicByTheme[themeName] = {
    ...(magicByTheme[themeName] ?? {}),
    ...makeMagic(
      getStyle(theme, themeName),
      (themeName ? "." + themeName : "") + (addPrefix ? " ." + addPrefix : addPrefix),
    ),
  };

  if (!mapByTheme[themeName]) {
    mapByTheme[themeName] = new Map<Function, true>();
    themeCache[themeName] = theme;
  }

  mapByTheme[themeName].set(getStyle, true);
  return echo("new Magic", merge(magicByTheme));
}

let currentTheme = "";
const subs: Map<Function, true> = new Map<Function, true>();

export
function themeSubscribe(setTheme: (_name: string) => void) {
  subs.set(setTheme, true);

  return () => {
    subs.delete(setTheme);
  };
}

themeSubscribe(name => currentTheme = name);

export function useTheme() {
  const [theme, setTheme] = useState(currentTheme);
  useEffect(() => themeSubscribe(setTheme), []);
  return theme;
}

interface MagicBoxProps extends WithThemeProps {
  theme?: string;
  getStyle?: typeof makeThemeMagicBook;
  Component: React.ComponentType<WithThemeProps>;
}

export function MagicBox(props: MagicBoxProps) {
  const { theme, Component, getStyle, ...rest } = props;

  for (let [sub] of subs)
    sub(theme);

  magic = getThemeMagic(theme ?? "", getStyle ?? makeThemeMagicBook);
  return <Component theme={theme} { ...rest } />;
}

// export this if you need to - to avoid problems with dependency duplication
// when you have multiple versions of this lib in your node_modules
export function withMagic(
  Component: React.ComponentType<WithThemeProps>,
  getStyle?: typeof makeThemeMagicBook,
): React.ComponentType<WithThemeProps>{
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
  const themeName = useTheme();
  return magic = getThemeMagic(themeName || currentTheme, getStyle ?? makeThemeMagicBook, addPrefix);
}


export function bindMagic(getStyle?: typeof makeThemeMagicBook, addPrefix?: string) {
  return () => {
    const themeName = useTheme();
    return useMemo(() => magic = getThemeMagic(themeName || currentTheme, getStyle ?? makeThemeMagicBook, addPrefix), [themeName]);
  }
}

export function withStyles(getStyle?: typeof makeThemeMagicBook, options?: object) {
  const getStyles = bindMagic(getStyle);

  return function realWithStyles(Component: React.ComponentType<WithClassesProps>) {
    return function WithClasses(props: object) {
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
          width: size + "px",
        },
      });
    }

    const cls = "size-horizontal-" + N + "-" + name;

    for (const [sub] of subs)
      sub(cls);

    return responsiveCache[N] = cls;
  }

  function subscribe(sub: (cls: string) => {}) {
    subs.set(sub, true);

    return () => {
      subs.delete(sub);
    };
  }

  const cls = outputSize();
  new ResizeObserver(outputSize).observe(el)

  return () => {
    const [responsive, setResponsive] = useState(cls);
    useEffect(subscribe(setResponsive), [setResponsive]);
    return responsive;
  };
}

export
function Svg(props) {
  const { src, ...rest } = props;
  if (typeof src === "string")
    return <img style={{ fill: "white" }} src={ src } { ...rest } />;
  const Component = src;
  return <Component { ...rest } />;
}

export
function withSvg(src) {
  const Component = src;

  if (typeof src === "string")
    return (props) => {
      return <img src={ src } { ...props } />;
    };

  else return (props) => {
    return <Component { ...props } />;
  };
}
