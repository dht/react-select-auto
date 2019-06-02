let styles = {
  "Select-container": {
    position: "relative"
  },
  "Select-container.rtl": {
    position: "relative",
    direction: "rtl"
  },
  placeholder: {
    padding: "10px 10px",
    fontWeight: 300,
    fontSize: "16px",
    border: "1px solid #aaa",
    borderRadius: "4px",
    boxSizing: "border-box",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  "placeholder>span.disabled": {
    color: "gray"
  },
  "placeholder>span": {
    flex: 1,
    wordWrap: "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  "placeholder>span.empty": {
    color: "gray"
  },
  options: {
    position: "absolute",
    top: "41px",
    zIndex: "5"
  },
  list: {
    border: "1px solid gray",
    borderRadius: "3px 3px 0 0",
    backgroundColor: "white",
    padding: "10px 0",
    maxHeight: "300px",
    overflow: "auto"
  },

  empty: {
    padding: "5px 10px",
    fontSize: "14px",
    color: "gray"
  },

  option: {
    padding: "5px 10px",
    cursor: "pointer",
    fontSize: "14px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  highlight: {
    color: "brown"
  },
  "option.selected": {
    fontWeight: "bold"
  },
  "option.rtl": {
    direction: "rtl"
  },
  "option.highlighted": {
    backgroundColor: "dodgerblue",
    color: "white"
  },
  "option.hover": {
    backgroundColor: "#f8f8f8"
  },
  search: {
    padding: "5px 10px",
    fontSize: "13px",
    color: "#999",
    border: "1px solid gray",
    borderTop: "0",
    borderRadius: "0 0 3px 3px",
    backgroundColor: "rgba(250, 250, 250, 0.86)"
  }
};

export const getStyle = (className, extra = {}) => {
  if (!className) return {};

  const parts = className.split(" ");
  const base = parts.shift();

  let output = styles[base] || {};

  parts.forEach(part => {
    const style = styles[base + "." + part];
    output = { ...output, ...style };
  });

  return { ...output, ...extra };
};
