import React from "react";
import { Css, Magic, MagicBook, MagicBag, Dependencies, SimpleThemeProps, WithThemeProps } from "../lib/types";
import { createTheme, Theme } from "@material-ui/core";

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

const horizontal0 = {
  display: "flex",
  flexDirection: "initial",
};

const horizontal = {
  ...horizontal0,
  gap: "16px",
};

const vertical0 = {
  display: "flex",
  flexDirection: "column",
};

const baseMagicBook = {
  horizontal0,
  horizontal,
  horizontalSmall: {
    ...horizontal0,
    gap: "8px",
  },
  blockHorizontal: {
    "& > *": {
      float: "left",
      marginLeft: "16px",
      "&:first": {
        marginLeft: "0px",
      }
    },
  },
  vertical0,
  vertical: {
    ...vertical0,
    rowGap: "16px",
  },
  verticalSmall: {
    ...vertical0,
    rowGap: "8px",
  },
  pad: {
    padding: "16px",
  },
  padSmall: {
    padding: "8px",
  },
  padVertical: {
    paddingTop: "16px",
    paddingBottom: "16px",
  },
  padVerticalSmall: {
    paddingTop: "8px",
    paddingBottom: "8px",
  },
  padHorizontal: {
    paddingLeft: "16px",
    paddingRight: "16px",
  },
  padHorizontalSmall: {
    paddingLeft: "8px",
    paddingRight: "8px",
  },
  tableHorizontalSmall: {
    "& th": {
      paddingLeft: "8px",
      paddingRight: "8px",
    },
    "& td": {
      paddingLeft: "8px",
      paddingRight: "8px",
    }
  },
  relative: {
    position: "relative",
  },
  absolute: {
    position: "absolute",
  },
  positionTop0: {
    top: 0,
  },
  positionLeft0: {
    left: 0,
  },
  positionRight0: {
    right: 0,
  },
  positionBottom0: {
    bottom: 0,
  },
  positionRightNeg: {
    right: "-16px",
  },
  positionTopNeg: {
    top: "-16px",
  },
  alignSelfStretch: {
    alignSelf: "stretch",
  },
  flexGrow: {
    flexGrow: 1,
  },
  overflowAuto: {
    overflow: "auto",
  },
  overflowHidden: {
    overflow: "hidden",
  },
  alignItemsStart: {
    alignItems: "flex-start",
  },
  alignItemsEnd: {
    alignItems: "flex-end",
  },
  alignItemsCenter: {
    alignItems: "center",
  },
  justifyContentCenter: {
    justifyContent: "center",
  },
  justifyContentEnd: {
    justifyContent: "flex-end",
  },
  justifyContentSpaceBetween: {
    justifyContent: "space-between",
  },
  sizeVerticalFull: {
    height: "100%",
  },
  sizeMaxVertical7Rem: {
    maxHeight: "7rem",
  },
  sizeHorizontalFull: {
    width: "100%",
  },
  textAlignCenter: {
    textAlign: "center",
  },
  marginHorizontalNeg: {
    marginLeft: "-16px",
    marginRight: "-16px",
  },
  marginVerticalNeg: {
    marginTop: "-16px",
    marginBottom: "-16px",
  },
  paddingHorizontalSmall: {
    paddingLeft: "8px",
    paddingRight: "8px",
  },
  paddingVerticalSmall: {
    paddingTop: "8px",
    paddingBottom: "8px",
  },
  cursorHorizontalResize: {
    cursor: "ew-resize",
  },
  cursorVerticalResize: {
    cursor: "ns-resize",
  },
  flexGrowChildren: {
    "& > *": {
      flexGrow: 1,
    },
  },
  verticalCenter: {
    display: "inline-flex !important",
    flexDirection: "column",
    justifyContent: "center",
  },
  flexWrap: {
    flexWrap: "wrap",
  },
  tableLayout: {
    tableLayout: "fixed",
  },
  tableLayoutFixed: {
    tableLayout: "fixed",
  },
  colorInherit: {
    color: "inherit",
  },
  backgroundInherit: {
    backgroundColor: "inherit",
  },
  backgroundWhite: {
    backgroundColor: "white",
  },
  backgroundBlack: {
    backgroundColor: "black",
  },
  marginLeftSmall: {
    marginLeft: "8px",
  },
  margin0: {
    margin: 0,
  },
  opacity3: {
    opacity: 0.3,
  },
  opacity5: {
    opacity: 0.5,
  },
  opacity8: {
    opacity: 0.8,
  },
  fontWeight:{
    fontWeight: 600,
  },
  fontWeightBold: {
    fontWeight: 600,
  },
  borderRadiusSmall: {
    borderRadius: "8px",
  },
  rotate:{
    transform: "rotate(90deg)",
  },
  rotatePiOverTwo: {
    transform: "rotate(90deg)",
  },
  textOverflowEllipsis: {
    textOverflow: "ellipsis",
  },
};

export function makeThemeMagicBook(themeName: string, theme: Theme): MagicBook {
  {/* console.log("makeThemeMagicBook", theme); */}
  return {
    paper: {
      light: {
        backgroundColor: "#d2d2d2",
      },
      dark: {
        backgroundColor: "#424242",
      },
    }[themeName] ?? {
      backgroundColor: "#d2d2d2",
    },
    caption: theme.typography.caption,
    h3: theme.typography.h3,
    h4: theme.typography.h4,
    h5: theme.typography.h5,
    h6: theme.typography.h6,
    subtitle2: theme.typography.subtitle2,
    colorPrimary: {
      color: theme.palette.text.primary + " !important",
    },
    colorSecondary: {
      color: theme.palette.text.secondary + " !important",
    },
    backgroundSuccess: {
      backgroundColor: theme.palette.success.main,
    },
    backgroundWarning: {
      backgroundColor: theme.palette.warning.main,
    },
    backgroundError: {
      backgroundColor: theme.palette.error.main,
    },
    backgroundSuccessLight: {
      backgroundColor: theme.palette.success.light,
    },
    backgroundWarningLight: {
      backgroundColor: theme.palette.warning.light,
    },
    backgroundErrorLight: {
      backgroundColor: theme.palette.error.light,
    },
    borderLeftDivider: {
      borderLeft: "solid thin " + theme.palette.divider,
    },
    borderTopDivider: {
      borderTop: "solid thin " + theme.palette.divider,
    },
    colorError: {
      color: theme.palette.error.main,
    },
    colorErrorLight: {
      color: theme.palette.error.light,
    },
  };
}

const defaultTheme = createTheme();
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
