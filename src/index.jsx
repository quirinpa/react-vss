export function cast(object, phrase) {
  return phrase.split(" ").map(word => {
    const value = object[word];

    if (!value)
      console.info("failed to cast " + word, object);

    return value;
  }).join(" ");
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
  pad: {
    padding: "16px",
  },
  padSmall: {
    padding: "8px",
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

export function makeInnerStyles(theme) {
  return {
    ...preStyles,
    caption: theme.typography.caption,
    h3: theme.typography.h3,
    h4: theme.typography.h4,
    borderLeftDivider: {
      borderLeft: "solid thin " + theme.palette.divider,
    },
    borderTopDivider: {
      borderTop: "solid thin " + theme.palette.divider,
    },
  };
}
