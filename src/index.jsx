import React, { useContext } from "react";
import PropTypes from "prop-types";

const MagicBookContext = React.createContext();

const defaultClasses = {};

export function cast(object = defaultClasses, phrase) {
  if (!phrase)
    return "";

  return phrase.split(" ").map(word => {
    const value = object[word];

    if (!value)
      console.info("failed to cast " + word);

    return value;
  }).join(" ");
}

export function useCast() {
  const context = useContext(MagicBookContext);
  return phrase => cast(context, phrase);
}

export function withCast(Component) {
  function CastComponent(props) {
    const c = useCast();

    return <Component c={c} { ...props } />;
  }

  return CastComponent;
}

export function withMagicBook(Component) {
  function ProviderComponent(props) {
    const { classes, ...rest } = props;

    return (
      <MagicBookContext.Provider value={classes}>
        <Component { ...rest } />
      </MagicBookContext.Provider>
    );
  }

  ProviderComponent.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string),
  };

  return ProviderComponent;
}

const LABELS = {
  SIZE: "size",
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
  FULL: "full",
  TEXT_ALIGN: "textAlign",
  ALIGN_ITEMS: "alignItems",
  JUSTIFY_CONTENT: "justifyContent",
  CENTER: "center",
  START: "start",
  END: "end",
  SPACE_BETWEEN: "spaceBetween",
  SMALL: "small",
  FLEX: "flex",
  WRAP: "wrap",
  PAD: "pad",
  TABLE: "table",
  FONT_WEIGHT: "fontWeight",
  BOLD: "bold",
  NO: "no",
  BLOCK: "block",
  TABLE_LAYOUT: "tableLayout",
  FIXED: "fixed",
  COLOR: "color",
  BACKGROUND: "background",
  INHERIT: "inherit",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  LIGHT: "light",
  MARGIN: "margin",
  POSITION: "position",
  NEGATIVE: "neg",
  LEFT: "left",
  RIGHT: "right",
  TOP: "top",
  ROTATE: "rotate",
  PI: "pi",
  OVER: "over",
  TWO: "two",
  OPACITY: "opacity",
  WHITE: "white",
  BLACK: "black",
};

function lab(phrase) {
  const ret = phrase.split(" ")
    .map(word => {
      const label = LABELS[word];
      if (!label)
        throw new Error("no label " + word);
      return label.charAt(0).toUpperCase() + label.substr(1);
    })
    .join("");

  return ret.charAt(0).toLowerCase() + ret.substr(1);
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

const preStyles = {
  horizontal0,
  [LABELS.HORIZONTAL]: horizontal,
  [lab("HORIZONTAL SMALL")]: {
    ...horizontal0,
    gap: "8px",
  },
  [lab("BLOCK HORIZONTAL")]: {
    "& > *": {
      float: "left",
      marginLeft: "16px",
      "&:first": {
        marginLeft: "0px",
      }
    },
  },
  vertical0,
  [LABELS.VERTICAL]: {
    ...vertical0,
    rowGap: "16px",
  },
  [lab("VERTICAL SMALL")]: {
    ...vertical0,
    rowGap: "8px",
  },
  [lab("PAD")]: {
    padding: "16px",
  },
  [lab("PAD SMALL")]: {
    padding: "8px",
  },
  [lab("PAD VERTICAL")]: {
    paddingTop: "16px",
    paddingBottom: "16px",
  },
  [lab("PAD VERTICAL SMALL")]: {
    paddingTop: "8px",
    paddingBottom: "8px",
  },
  [lab("PAD HORIZONTAL")]: {
    paddingLeft: "16px",
    paddingRight: "16px",
  },
  [lab("PAD HORIZONTAL SMALL")]: {
    paddingLeft: "8px",
    paddingRight: "8px",
  },
  [lab("TABLE HORIZONTAL SMALL")]: {
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
  [lab("POSITION RIGHT NEGATIVE")]: {
    right: "-16px",
  },
  [lab("POSITION TOP NEGATIVE")]: {
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
  [lab("ALIGN_ITEMS START")]: {
    alignItems: "flex-start",
  },
  [lab("ALIGN_ITEMS END")]: {
    alignItems: "flex-end",
  },
  [lab("ALIGN_ITEMS CENTER")]: {
    alignItems: "center",
  },
  [lab("JUSTIFY_CONTENT CENTER")]: {
    justifyContent: "center",
  },
  [lab("JUSTIFY_CONTENT END")]: {
    justifyContent: "flex-end",
  },
  [lab("JUSTIFY_CONTENT SPACE_BETWEEN")]: {
    justifyContent: "space-between",
  },
  [lab("SIZE VERTICAL FULL")]: {
    height: "100%",
  },
  [lab("SIZE HORIZONTAL FULL")]: {
    width: "100%",
  },
  [lab("TEXT_ALIGN CENTER")]: {
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
  [lab("FLEX WRAP")]: {
    flexWrap: "wrap",
  },
  [lab("TABLE_LAYOUT FIXED")]: {
    tableLayout: "fixed",
  },
  [lab("COLOR INHERIT")]: {
    color: "inherit",
  },
  [lab("BACKGROUND INHERIT")]: {
    backgroundColor: "inherit",
  },
  [lab("BACKGROUND WHITE")]: {
    backgroundColor: "white",
  },
  [lab("BACKGROUND BLACK")]: {
    backgroundColor: "black",
  },
  [lab("MARGIN LEFT SMALL")]: {
    marginLeft: "8px",
  },
  [lab("MARGIN") + 0]: {
    margin: 0,
  },
  [lab("OPACITY") + 3]: {
    opacity: 0.3,
  },
  [lab("OPACITY") + 5]: {
    opacity: 0.5,
  },
  [lab("OPACITY") + 8]: {
    opacity: 0.8,
  },
};

export function makeMagicBook(theme) {
  return {
    ...preStyles,
    caption: theme.typography.caption,
    h3: theme.typography.h3,
    h4: theme.typography.h4,
    h5: theme.typography.h5,
    h6: theme.typography.h6,
    subtitle2: theme.typography.subtitle2,
    textPrimary: {
      color: theme.palette.text.primary,
    },
    textSecondary: {
      color: theme.palette.text.secondary,
    },
    [lab("BACKGROUND SUCCESS")]: {
      backgroundColor: theme.palette.success.main,
    },
    [lab("BACKGROUND WARNING")]: {
      backgroundColor: theme.palette.warning.main,
    },
    [lab("BACKGROUND ERROR")]: {
      backgroundColor: theme.palette.error.main,
    },
    [lab("BACKGROUND SUCCESS LIGHT")]: {
      backgroundColor: theme.palette.success.light,
    },
    [lab("BACKGROUND WARNING LIGHT")]: {
      backgroundColor: theme.palette.warning.light,
    },
    [lab("BACKGROUND ERROR LIGHT")]: {
      backgroundColor: theme.palette.error.light,
    },
    borderLeftDivider: {
      borderLeft: "solid thin " + theme.palette.divider,
    },
    borderTopDivider: {
      borderTop: "solid thin " + theme.palette.divider,
    },
    [lab("FONT_WEIGHT BOLD")]: {
      fontWeight: 600,
    },
    borderRadiusSmall: {
      borderRadius: "8px",
    },
    [lab("COLOR ERROR")]: {
      color: theme.palette.error.main,
    },
    [lab("COLOR ERROR LIGHT")]: {
      color: theme.palette.error.light,
    },
    [lab("ROTATE PI OVER TWO")]: {
      transform: "rotate(90deg)",
    },
  };
}