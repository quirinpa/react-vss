import React, { useState, useEffect, useMemo } from "react";

import {
  Theme, SpacingOctave, Css, Magic, MagicBook,
  WithThemeProps, WithClassesProps,
} from "../lib/types";

const debug = false;

function echo(msg: string, value: any) {
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

function cssTransform(classes: Magic, content: Css, dashKey: string, value: Css, reprefix: string = "") {
  {/* echo("cssTransform", [dashKey]); */}
  if (!value)
    return "";

  let ret = "";
  const firstChar = dashKey.charAt(0);
  const noConvert = firstChar === "!" || firstChar === "?";
  if (noConvert)
    dashKey = dashKey.substring(1);

  for (const [key, spell] of Object.entries(value)) {
    if (typeof spell !== "object") {
      if (!content[dashKey])
        content[dashKey] = {};
      content[dashKey][key] = spell;
      continue;
    }

    ret += cssTransform(classes, content, dashKey + key.substring(1), spell, reprefix);
  }

  if (content[dashKey]) {
    const camel = noConvert ? dashKey : camelCaseDash(dashKey);
    {/* if (dashKey.indexOf(" ") === -1) */}
    if (!classes[camel])
      classes[camel] = dashKey;
    const cssContent = Object.entries(content[dashKey]).filter(
      ([key]) => key.charAt(0) !== "&"
    ).map(([key, value]: [string, any]) => dashCamelCase(key) + ": " + value.toString() + ";\n").join("");

    if (noConvert && firstChar === "?") {
      ret += dashKey + reprefix + " {\n" + cssContent + "}\n";
    } else {
      ret += reprefix + "." + dashKey + " {\n" + cssContent + "}\n";
      ret += reprefix + " ." + dashKey + " {\n" + cssContent + "}\n";
    }
  }

  {/* echo("cssTransform", [reprefix, dashKey, classes, content]); */}
  return ret;
}

export
function makeMagic(obj: object, prefix?: string) {
  const reprefix = prefix ?? "";
  const style = document.createElement("style");
  let classes = {};
  let css = "";

  for (const [key, value] of Object.entries(obj)) {
    const firstChar = key.charAt(0);
    css += cssTransform(classes, {}, firstChar === "!" || firstChar === "?" ? key : dashCamelCase(key), value, reprefix);
  }

  echo("ADD STYLE\n",  css);
  style.appendChild(document.createTextNode(css));
  style.type = "text/css";
  document.head.appendChild(style);
  return classes;
}

const horizontal0 = { display: "flex", flexDirection: "initial" };
const vertical0 = { display: "flex", flexDirection: "column" };

function reducer(allMagicTable, prefix, property, a, [key, value]) {
  return key === "*" ? { ...a, magic: value } : {
    ...a,
    [prefix + key]: { ...allMagicTable, [property]: value }
  };
}

function recurseReducer(allMagicTable, prefix, a, [key, value]) {
  return key === "*" ? a : {
    ...a,
    [prefix + key]: { ...allMagicTable, ...getMagicTable(prefix, value, "*") }
  };
}

export
function getMagicTable(prefix, table, property?) {
  const realProperty = property ?? dashCamelCase(prefix);
  const allMagicTable = table["*"] ?? {};

  if (!table || typeof table !== "object")
    return table;

  return Object.entries(table).reduce(
    (property !== "*" ? reducer.bind(null, allMagicTable, prefix, realProperty)
      : recurseReducer.bind(null, allMagicTable, prefix)),
    {}
  );
}

export
const baseMagicBook = {
  horizontal0,
  vertical0,
  relative: { position: "relative" },
  absolute: { position: "absolute" },
  positionTop0: { top: 0 },
  positionLeft0: { left: 0 },
  positionRight0: { right: 0 },
  positionBottom0: { bottom: 0 },
  margin0: { margin: 0 },
  marginTop0: { marginTop: 0 },
  marginLeft0: { marginLeft: 0 },
  marginRight0: { marginRight: 0 },
  marginBottom0: { marginBottom: 0 },
  padding0: { padding: 0 },
  paddingTop0: { paddingTop: 0 },
  paddingLeft0: { paddingLeft: 0 },
  paddingRight0: { paddingRight: 0 },
  paddingBottom0: { paddingBottom: 0 },
  ...getMagicTable("alignSelf", {
    "": "stretch",
  }),
  flexGrow: { flexGrow: 1 },
  ...getMagicTable("overflow", {
    "": "auto",
    Hidden: "hidden",
  }),
  ...getMagicTable("alignItems", {
    "": "center",
    Start: "start",
    End: "end",
  }),
  ...getMagicTable("justifyContent", {
    "": "center",
    Start: "start",
    SpaceAround: "space-around",
    SpaceBetween: "space-between",
    End: "end",
  }),
  sizeVerticalFull: { height: "100%" },
  sizeHorizontalFull: { width: "100%" },
  sizeHorizontalHalf: { width: "50%" },
  sizeHorizontalQuarter: { width: "25%" },
  sizeMaxVertical7Rem: {
    maxHeight: "7rem",
  },
  ...getMagicTable("textAlign", {
    Left: "left",
    "": "center",
    Right: "right",
  }),
  ...getMagicTable("cursorHorizontal", {
    "": "ew-resize"
  }, "cursor"),
  ...getMagicTable("cursorVertical", {
    "": "ns-resize"
  }, "cursor"),
  flexGrowChildren: { "& > *": { flexGrow: 1 } },
  verticalCenter: {
    display: "inline-flex !important",
    flexDirection: "column",
    justifyContent: "center",
  },
  flexWrap: { flexWrap: "wrap" },
  ...getMagicTable("tableLayout", {
    "": "fixed",
  }),
  ...getMagicTable("color", {
    "": "inherit",
    White: "white",
    Black: "black",
  }),
  ...getMagicTable("background", {
    "": "inherit",
    White: "white",
    Black: "black",
  }, "background-color"),
  ...getMagicTable("opacity", {
    Smallest: 0.1,
    Small: 0.3,
    "": 0.5,
    Big: 0.8,
    Biggest: 1,
  }),
  ...getMagicTable("fontWeight", {
    "": 600,
  }),
  ...getMagicTable("rotate", {
    "": "rotate(90deg)",
  }, "transform"),
  ...getMagicTable("textOverflow", {
    "": "ellipsis",
  }),
};

const baseMagic = makeMagic(baseMagicBook);

let magicByTheme = {
  "": baseMagic,
};

let mapByTheme = {
  "": new Map<Function, true>(),
};
export let magic = merge(magicByTheme);

export function makeThemeMagicBook(theme: Theme, themeName: string): MagicBook {
  const spacings: SpacingOctave[] = theme.spacing && typeof(theme.spacing) !== "string"
    ? theme.spacing : defaultSpacing;
  echo("makeThemeMagicBook", [themeName, theme]);

  let spacingSpells = {};

  for (const spacing of spacings)
    for (let i = (spacing.min ?? 0); i < (spacing.max ?? spacingsTable.length); i += (spacing.step ?? 1)) {
      const [label, value] = (spacing.func ?? defaultSpacingFunc)(i);
      spacingSpells["horizontal" + label] = { ...horizontal0, gap: value };
      spacingSpells["blockHorizontal" + label] = {
        "& > *": {
          float: "left",
          marginLeft: value,
          "&:first": { marginLeft: "0px" }
        },
      };
      spacingSpells["vertical" + label] = { ...vertical0, rowGap: value };
      spacingSpells["pad" + label] = { padding: value };
      spacingSpells["padVertical" + label] = { paddingTop: value, paddingBottom: value };
      spacingSpells["padHorizontal" + label] = { paddingLeft: value, paddingRight: value };
      spacingSpells["tableHorizontal" + label] = {
        "& th": {
          paddingLeft: "calc(" + value + "/2)",
          paddingRight: "calc(" + value + "/2)",
        },
        "& td": {
          paddingLeft: "calc(" + value + "/2)",
          paddingRight: "calc(" + value + "/2)",
        }
      };
      spacingSpells["positionTop" + label] = { top: value };
      spacingSpells["positionBottom" + label] = { bottom: value };
      spacingSpells["positionLeft" + label] = { left: value };
      spacingSpells["positionRight" + label] = { right: value };
      spacingSpells["positionTop" + label + "Neg"] = { top: "-" + value };
      spacingSpells["positionBottom" + label + "Neg"] = { bottom: "-" + value };
      spacingSpells["positionLeft" + label + "Neg"] = { left: "-" + value };
      spacingSpells["positionRight" + label + "Neg"] = { right: "-" + value };
      spacingSpells["margin" + label] = { margin: value };
      spacingSpells["marginNeg" + label] = { margin: "-" + value };
      spacingSpells["marginVertical" + label] = { marginTop: value, marginBottom: value };
      spacingSpells["marginHorizontal" + label] = { marginLeft: value, marginRight: value };
      spacingSpells["marginVertical" + label + "Neg"] = { marginTop: "-" + value, marginBottom: "-" + value };
      spacingSpells["marginHorizontal" + label + "Neg"] = { marginLeft: "-" + value, marginRight: "-" + value };
      spacingSpells["marginTop" + label] = { marginTop: value };
      spacingSpells["marginBottom" + label] = { marginBottom: value };
      spacingSpells["marginLeft" + label] = { marginLeft: value };
      spacingSpells["marginRight" + label] = { marginRight: value };
      spacingSpells["borderRadius" + label] = { borderRadius: value };
      spacingSpells["sizeHorizontal" + label] = { width: value };
      spacingSpells["sizeVertical" + label] = { height: value };
      spacingSpells["size" + label] = { width: value, height: value };
    }

  return {
    "!MuiPaper-root": {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    "!MuiToolbar-root": {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    "!MuiIconButton-root": { color: theme.palette.primary.main + " !important" },
    "!MuiInputBase-root": { color: theme.palette.text.primary + " !important" },
    "?body": {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
    menuItem: {
      ...baseMagicBook.vertical0,
      padding: "8px",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    ...baseMagicBook,
    ...spacingSpells,
    caption: theme.typography.caption,
    h3: theme.typography.h3,
    h4: theme.typography.h4,
    h5: theme.typography.h5,
    h6: theme.typography.h6,
    subtitle2: theme.typography.subtitle2,
    ...getMagicTable("color", {
      "": theme.palette.text.primary + " !important",
      Secondary: theme.palette.text.secondary + " !important",
      Success: theme.palette.success.main + "!important",
      SucessLight: theme.palette.success.light + "!important",
      Warning: theme.palette.warning.main + "!important",
      WarningLight: theme.palette.warning.light + "!important",
      "Error": theme.palette.error.main + "!important",
      ErrorLight: theme.palette.error.light + "!important",
    }),
    ...getMagicTable("background", {
      "": theme.palette.background.paper,
      Success: theme.palette.success.main,
      SucessLight: theme.palette.success.light,
      Warning: theme.palette.warning.main,
      WarningLight: theme.palette.warning.light,
      "Error": theme.palette.error.main,
      ErrorLight: theme.palette.error.light,
    }, "background-color"),
    borderLeft: {
      borderLeft: "solid thin " + theme.palette.divider,
    },
    borderTop: {
      borderTop: "solid thin " + theme.palette.divider,
    },
  };
}

let themeCache = {};

const spacingsTable = [
  ["Smallest", "4px"],
  ["Small", "8px"],
  ["", "16px"],
  ["Big", "32px"],
  ["Biggest", "64px"],
];

const defaultSpacingFunc = a => spacingsTable[a];

const defaultSpacing = [{
  func: defaultSpacingFunc,
  min: 0,
  max: spacingsTable.length,
  step: 1,
}] as [SpacingOctave, ...SpacingOctave[]];

export
const defaultTheme: Theme = {
  palette: {
    type: "light",
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
    fontSize: 14,
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
  spacing: defaultSpacing,
};

themeCache[""] = defaultTheme;

export
function merge(obj: object) {
  let ret = {};

  for (const value of Object.values(obj))
    for (const [subKey, subValue] of Object.entries(value))
      ret[subKey] = subValue;

  return ret;
}

export
function cast(phrase : string): string {
  return phrase.split(" ").map(camelCaseDash).join(" ");
}

export function defaultGetTheme(name) {
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

export function bindMagic(getStyle?: typeof makeThemeMagicBook, addPrefix?: string) {
  return () => {
    const themeName = useTheme();
    return useMemo(() => magic = getThemeMagic(themeName || currentTheme, getStyle ?? makeThemeMagicBook, addPrefix), [themeName]);
  }
}

export function withStyles(
  Component: React.ComponentType<WithClassesProps>
) {
  const getStyles = bindMagic();
  return function WithClasses(props: object) {
    const mag = getStyles();
    return <Component classes={mag} { ...props } />;
  };
}
