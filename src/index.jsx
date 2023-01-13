import React, { useContext } from "react";
import PropTypes from "prop-types";

const GrimoireContext = React.createContext();

export function GrimoireProvider(props) {
  const { value, children } = props;

  return (<GrimoireContext.Provider value={value}>
    { children }
  </GrimoireContext.Provider>);
}

GrimoireProvider.propTypes = {
  value: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export function cast(object, phrase) {
  return phrase.split(" ").map(word => {
    const value = object[word];

    if (!value)
      console.info("failed to cast " + word, object);

    return value;
  }).join(" ");
}

export function useCast() {
  const context = useContext(CastContext);
  return phrase => cast(context, phrase);
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
  END: "end",
  SPACE_BETWEEN: "spaceBetween",
  SMALL: "small",
  FLEX: "flex",
  WRAP: "wrap",
  PAD: "pad",
  TABLE: "table",
  FONT_WEIGHT: "fontWeight",
  BOLD: "bold",
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
  alignSelfStretch: {
    alignSelf: "stretch",
  },
  flexGrow: {
    flexGrow: 1,
  },
  overflowAuto: {
    overflow: "auto",
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
  [lab("FLEX WRAP")]: {
    flexWrap: "wrap",
  },
};

export function makeGrimoire(theme) {
  return {
    ...preStyles,
    caption: theme.typography.caption,
    h3: theme.typography.h3,
    h4: theme.typography.h4,
    subtitle2: theme.typography.subtitle2,
    textPrimary: {
      color: theme.palette.text.primary,
    },
    textSecondary: {
      color: theme.palette.text.secondary,
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
  };
}
