import React, { useContext } from "react";
import { Cast, Css, Magic, MagicBook, MagicClassesProps, CastProps, CastComponentProps, Dependencies, WithThemeProps } from "../lib/types";
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

  const fullKey = reprefix + dashKey;
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
    if (fullKey.indexOf(" ") === -1)
      classes[camelCaseDash(fullKey)] = fullKey;
    ret += "." + fullKey + " {\n" + Object.entries(content[fullKey]).map(
      ([key, value]: [string, any]) => dashCamelCase(key) + ": " + value.toString() + ";\n"
    ).join("") + "}\n";
  }

  return ret;
}

function makeMagic(obj: object, prefix = "") {
  const reprefix = prefix ? prefix + "-" : "";
  const style = document.createElement("style");
  let classes = {};
  let css = "";

  for (const [key, value] of Object.entries(obj))
    css += cssTransform(classes, {}, dashCamelCase(key), value, reprefix);

  {/* console.log("css", css); */}
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

export function makeThemeMagicBook(theme: Theme) {
  return {
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
export const themeMagicBook = makeThemeMagicBook(defaultTheme);

interface MagicBag {
  [key: string]: MagicBook;
}

export const defaultMagicBag = { base: baseMagicBook, theme: themeMagicBook };

export
function merge(magicBag: MagicBag): MagicBook {
  let ret = {};

  for (const magicBook of Object.values(magicBag))
    for (const [spellKey, spell] of Object.entries(magicBook))
      ret[spellKey] = spell;

  return ret;
}

export const defaultMagic = makeMagic(merge(defaultMagicBag));

export
const MagicContext = React.createContext<Magic>(defaultMagic);

function cast(object: Magic, phrase : string): string {
  if (!object)
    object = {};

  if (!phrase)
    return "";

  return phrase.split(" ").map(word => {
    const value = object[word];

    if (!value)
      console.info("failed to cast " + word);

    return value;
  }).join(" ");
}

export function useCast(Context: React.Context<Magic>|null): Cast {
  const magic = useContext(Context ?? MagicContext);
  return (phrase: string) => cast(magic, phrase);
}

export function withCast(
  Component : React.ComponentType<CastProps>
): React.FC<CastComponentProps> {
  function CastComponent(props: CastComponentProps) {
    const { dependencies = {}, ...rest } = props;
    const c = useCast(dependencies["@tty-pt/styles"]?.MagicContext ?? MagicContext);

    return <Component c={c} { ...rest } />;
  }

  return CastComponent;
}

export function withMagicClasses<P extends object>(Component: React.ComponentType<P>, Context: React.Context<Magic> = MagicContext): React.FC<P&MagicClassesProps> {
  function ProviderComponent(props: any) {
    const { classes, ...rest } = props;

    return (
      <Context.Provider value={classes}>
        <Component { ...rest } />
      </Context.Provider>
    );
  }

  return ProviderComponent;
}

export function withMagic(
  Component: React.ComponentType<object>,
  getStyle: typeof makeThemeMagicBook = makeThemeMagicBook,
  dependencies: Dependencies = {}
): React.FC<WithThemeProps>{
  return function WithMagic(props: WithThemeProps) {
    const { theme, ...rest } = props;

    const magic: Magic = theme ? (dependencies["@tty-pt/styles"]?.makeMagic ?? makeMagic)(
      getStyle(theme)
    ) : defaultMagic;

    const Context = dependencies["@tty-pt/styles"]?.MagicContext ?? MagicContext;

    return (<Context.Provider value={magic}>
      <Component { ...rest } />
    </Context.Provider>);
  };
}
