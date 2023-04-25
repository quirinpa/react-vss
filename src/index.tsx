import React from "react";
import { Theme, SpacingOctave, Css, Magic, MagicBook, MagicBag, Dependencies, SimpleThemeProps, WithThemeProps } from "../lib/types";
import { createTheme } from "@material-ui/core";

export function dashCamelCase(camelCase: string) {
  return camelCase.replace(/([A-Z0-9])+/g, function (g) { return "-" + g.toLowerCase(); })
    .replace(/([0-9][a-z]+)/g, function (g) { return g.substring(0, 1) + "-" + g.substring(1); });
}

export function camelCaseDash(dash: string) {
  return dash.replace(/-([a-zA-Z0-9])+/g, function (g) { return g.substring(1, 2).toUpperCase() + g.substring(2); });
}

function cssTransform(classes: Magic, content: Css, dashKey: string, value: Css, reprefix: string = "") {
  {/* console.log("cssTransform", classes, content, dashKey, value, reprefix); */}
  if (!value)
    return [];

  const fullKey = reprefix + "." + dashKey;
  let ret = "";

  for (const [key, spell] of Object.entries(value)) {
    if (key.indexOf(" ") === -1) {
      if (!content[fullKey])
        content[fullKey] = {};
      content[fullKey][key] = spell;
      continue;
    }

    const innerKey = fullKey + key.substring(1);
    ret += cssTransform(classes, content, innerKey, spell, reprefix);
  }

  {/* console.log("cssTransform check", content, fullKey); */}
  if (content[fullKey]) {
    if (dashKey.indexOf(" ") === -1)
      classes[camelCaseDash(dashKey)] = dashKey;
    ret += fullKey + " {\n" + Object.entries(content[fullKey]).map(
      ([key, value]: [string, any]) => dashCamelCase(key) + ": " + value.toString() + ";\n"
    ).join("") + "}\n";
  }

  return ret;
}

export
function makeMagic(obj: object, reprefix = "") {
  const style = document.createElement("style");
  let classes = {};
  let css = "";

  for (const [key, value] of Object.entries(obj))
    css += cssTransform(classes, {}, dashCamelCase(key), value, reprefix);

  {/* console.log("css", css); */}
  {/* console.log("added css sheet", reprefix); */}
  style.appendChild(document.createTextNode(css));
  style.type = "text/css";
  document.head.appendChild(style);
  return classes;
}

const horizontal0 = { display: "flex", flexDirection: "initial" };
const vertical0 = { display: "flex", flexDirection: "column" };

function getTable(prefix, table, property?) {
  const realProperty = property ?? dashCamelCase(prefix);
  return Object.entries(table).reduce((a, [key, value]) => ({
    ...a,
    [prefix + key]: { [realProperty]: value }
  }), {});
}

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
  ...getTable("alignSelf", {
    "": "stretch",
  }),
  flexGrow: { flexGrow: 1 },
  ...getTable("overflow", {
    "": "auto",
    Hidden: "hidden",
  }),
  ...getTable("alignItems", {
    "": "center",
    Start: "start",
    End: "end",
  }),
  ...getTable("justifyContent", {
    "": "center",
    Start: "start",
    SpaceBetween: "space-between",
    End: "end",
  }),
  sizeVerticalFull: { height: "100%" },
  sizeHorizontalFull: { width: "100%" },
  sizeMaxVertical7Rem: {
    maxHeight: "7rem",
  },
  ...getTable("textAlign", {
    Left: "left",
    "": "center",
    Right: "right",
  }),
  ...getTable("cursorHorizontal", {
    "": "ew-resize"
  }, "cursor"),
  ...getTable("cursorVertical", {
    "": "ns-resize"
  }, "cursor"),
  flexGrowChildren: { "& > *": { flexGrow: 1 } },
  verticalCenter: {
    display: "inline-flex !important",
    flexDirection: "column",
    justifyContent: "center",
  },
  flexWrap: { flexWrap: "wrap" },
  ...getTable("tableLayout", {
    "": "fixed",
  }),
  ...getTable("color", {
    "": "inherit",
    White: "white",
    Black: "black",
  }),
  ...getTable("background", {
    "": "inherit",
    White: "white",
    Black: "black",
  }, "background-color"),
  ...getTable("opacity", {
    Smallest: 0.1,
    Small: 0.3,
    "": 0.5,
    Big: 0.8,
    Biggest: 1,
  }),
  ...getTable("fontWeight", {
    "": 600,
  }),
  ...getTable("rotate", {
    "": "rotate(90deg)",
  }, "transform"),
  ...getTable("textOverflow", {
    "": "ellipsis",
  }),
};

export function makeThemeMagicBook(themeName: string, theme: Theme): MagicBook {
  const spacings: SpacingOctave[] = theme.spacing && typeof(theme.spacing) !== "string"
    ? theme.spacing : defaultSpacing;

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
          paddingLeft: "8px",
          paddingRight: "8px",
        },
        "& td": {
          paddingLeft: "8px",
          paddingRight: "8px",
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
    }

  const paperColorTable = {
    "": "#d2d2d2",
    Dark: "#424242",
  };

  const paperColor = paperColorTable[themeName === "light" ? ""
    : themeName.substring(0, 1).toUpperCase() + themeName.substring(1)
  ] ?? "#d2d2d2";

  {/* console.log("makeThemeMagicBook", theme); */}
  return {
    ...spacingSpells,
    paper: { backgroundColor: paperColor },
    caption: theme.typography.caption,
    h3: theme.typography.h3,
    h4: theme.typography.h4,
    h5: theme.typography.h5,
    h6: theme.typography.h6,
    subtitle2: theme.typography.subtitle2,
    ...getTable("color", {
      "": theme.palette.text.primary + " !important",
      Secondary: theme.palette.text.secondary + " !important",
      Success: theme.palette.success.main,
      SucessLight: theme.palette.success.light,
      Warning: theme.palette.warning.main,
      WarningLight: theme.palette.warning.light,
      "Error": theme.palette.error.main,
      ErrorLight: theme.palette.error.light,
    }),
    ...getTable("background", {
      "": paperColor,
      Success: theme.palette.success.main,
      SucessLight: theme.palette.success.light,
      Warning: theme.palette.warning.main,
      WarningLight: theme.palette.warning.light,
      "Error": theme.palette.error.main,
      ErrorLight: theme.palette.error.light,
    }, "background-color"),
    borderLeftDivider: {
      borderLeft: "solid thin " + theme.palette.divider,
    },
    borderTopDivider: {
      borderTop: "solid thin " + theme.palette.divider,
    },
  };
}

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
}];

const defaultTheme: Theme = (() => ({
  ...createTheme(),
  spacing: defaultSpacing,
}))();

export const themeMagicBook = makeThemeMagicBook("light", defaultTheme);

export const defaultMagicBag = {
  "": { ...baseMagicBook, ...themeMagicBook },
};

export
function merge(obj: object) {
  let ret = {};

  for (const value of Object.values(obj))
    for (const [subKey, subValue] of Object.entries(value))
      ret[subKey] = subValue;

  return ret;
}

export
function mergeBag(magicBag: MagicBag) {
  let ret = {};

  for (const [magicBookKey, magicBook] of Object.entries(magicBag))
    for (const [magicKey, magic] of Object.entries(makeMagic(magicBook, magicBookKey)))
      ret[magicKey] = magic;

  return ret;
}

export const defaultMagic = mergeBag(defaultMagicBag);

export
function cast(phrase : string): string {
  return phrase.split(" ").map(camelCaseDash).join(" ");
}

let cache = {};
let mergeCache = {};
let themeCache = {};

export
function getMagicTheme(str) {
  return themeCache[str] ?? defaultTheme;
}

export function getThemeMagic(theme: string, getTheme: typeof getMagicTheme, getStyle: typeof makeThemeMagicBook) {
  {/* console.log("getThemeMagic", theme, getTheme, getStyle, cache); */}
  const item = cache[theme];

  if (item)
    return mergeCache;

  const realTheme = getTheme(theme);
  {/* console.log("getThemeMagic", theme, realTheme); */}
  cache[theme] = makeMagic(getStyle(theme, realTheme), "." + theme + " ");
  themeCache[theme] = realTheme;
  return mergeCache = merge(cache);
}

interface MagicBoxProps {
  theme?: string;
  getTheme?: typeof getMagicTheme;
  getStyle?: typeof makeThemeMagicBook;
  dependencies?: Dependencies;
  className?: string;
}

export function MagicBox(props: React.PropsWithChildren<MagicBoxProps>) {
  const {
    theme, children, getTheme, getStyle,
    dependencies = {}, className, ...rest
  } = props;

  (dependencies?.["@tty-pt/styles"]?.getThemeMagic ?? getThemeMagic)(
    theme ?? "light",
    getTheme ?? dependencies?.["@tty-pt/styles"]?.getMagicTheme ?? getMagicTheme,
    getStyle ?? dependencies?.["@tty-pt/styles"]?.makeThemeMagicBook ?? makeThemeMagicBook,
  );

  return (<div className={className + " " + theme} { ...rest } >
    { children }
  </div>);
}

export function withMagic(
  Component: React.ComponentType<SimpleThemeProps>,
  dependencies?: Dependencies,
): React.ComponentType<WithThemeProps>{
  return function WithMagicBox(props: WithThemeProps) {
    const { theme, className, ...rest } = props;

    return (<MagicBox
      theme={theme}
      className={className}
      dependencies={dependencies}
    >
      <Component theme={theme} { ...rest } />
    </MagicBox>);
  };
}
