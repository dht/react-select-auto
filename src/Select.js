// @flow
import React, { Component } from "react";
import "./Select.scss";
import classnames from "classnames";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import all from "./i18n";

export class Select extends Component {
  static defaultProps = {
    locale: "en",
    maxWidth: 250
  };

  state = {
    open: false,
    query: "",
    index: 3
  };

  constructor() {
    super();

    this.container = React.createRef();
    this.overlay = React.createRef();
    this.list = React.createRef();
  }

  get options() {
    const { options } = this.props;
    const { query } = this.state;

    return options
      .filter(option => {
        const { title = "" } = option;

        return !query || title.toLowerCase().indexOf(query) >= 0;
      })
      .sort((a, b) => {
        const aTitle = a.title;
        const bTitle = b.title;

        if (aTitle === bTitle) return 0;

        return aTitle > bTitle ? 1 : -1;
      });
  }

  get highlightedOption() {
    const { index } = this.state;

    return this.options[index];
  }

  get title() {
    const { value } = this.props;

    const item = this.options.filter(option => option.id === value)[0];
    const { title } = item || {};

    return title;
  }

  get i18n() {
    const { locale } = this.props;

    return all[locale] || all["en"];
  }

  componentDidMount() {
    document.addEventListener("keydown", this.keydown);
    document.addEventListener("click", this.click);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keydown);
    document.removeEventListener("click", this.click);
  }

  click = ev => {
    const { open } = this.state;

    if (!open) return;

    if (this.isOutside(ev)) {
      this.toggleOpen();
    }
  };

  isOutside = ev => {
    let target = ev.target,
      runs = 0;

    while (runs < 20 && target && target !== this.container.current) {
      target = target.parentNode;
    }

    return target !== this.container.current;
  };

  legalKey = key => {
    let { query = "" } = this.state;
    const i18n = this.i18n,
      { allowedLetters = [] } = i18n;

    return (
      (query.length > 0 && key === " " && this.lastKey !== " ") ||
      (key >= allowedLetters[0] && key <= allowedLetters[1])
    );
  };

  keydown = ev => {
    let { open, query = "", index = -1 } = this.state;

    if (!open) return;

    if (ev.which === 8) {
      this.setState({ query: "" });
      return;
    }

    if (ev.which === 27) {
      this.toggleOpen();
      ev.preventDefault();
      return;
    }

    if (ev.which === 13) {
      this.selectOption(this.highlightedOption);
      ev.preventDefault();
      return;
    }

    if (ev.which === 38) {
      this.nudgeIndex(-1);

      ev.preventDefault();
      return;
    }

    if (ev.which === 40) {
      this.nudgeIndex(+1);

      ev.preventDefault();
      return;
    }

    if (this.legalKey(ev.key)) {
      this.lastKey = ev.key;
      query += ev.key;
      this.setState({ query, index: 0 });
    }
  };

  highlightedRelativePosition = index => {
    try {
      const list = this.list.current;
      const options = [...list.querySelectorAll(".option")],
        option = options[index];

      const boxList = list.getBoundingClientRect();
      const boxOption = option.getBoundingClientRect();

      const listYs = [boxList.y, boxList.y + boxList.height];
      const boxYs = [boxOption.y, boxOption.y + boxOption.height];

      const deltaTop = boxYs[0] - listYs[0];
      const deltaBottom = listYs[1] - boxYs[1];

      return [deltaTop, deltaBottom];
    } catch (e) {
      return [0, 0];
    }
  };

  scroll = delta => {
    const list = this.list.current;
    list.scrollTop = list.scrollTop + delta;
  };

  nudgeIndex = delta => {
    let { index } = this.state;
    index += delta;
    index = Math.min(index + 1, this.options.length);
    index = Math.max(index - 1, 0);
    this.setState({ index });

    const relativePosition = this.highlightedRelativePosition(index);

    if (relativePosition[0] < 0) {
      this.scroll(relativePosition[0]);
    }

    if (relativePosition[1] < 0) {
      this.scroll(-relativePosition[1]);
    }
  };

  escapeRegexCharacters = str => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  getSuggestions = value => {
    const { items } = this.state;
    const escapedValue = this.escapeRegexCharacters(value.trim());

    if (escapedValue === "") {
      return [];
    }

    const regex = new RegExp(escapedValue, "i");

    return items.filter(item => regex.test(this.getSuggestionValue(item)));
  };

  getSuggestionValue = suggestion => {
    return `${suggestion.title}`;
  };

  renderArrow() {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        <path fill="none" d="M0 0h24v24H0V0z" />
      </svg>
    );
  }

  renderPlaceholder() {
    const { placeholder } = this.props;
    const title = this.title;

    const className = classnames("placeholder", {
      title
    });

    const text = title || placeholder;

    return (
      <div className={className} onClick={this.toggleOpen}>
        <span>{text}</span>
        {this.renderArrow()}
      </div>
    );
  }

  selectOption = option => {
    const { name } = this.props;

    let ev = {
      target: {
        value: option.id,
        name
      }
    };

    this.toggleOpen();
    this.props.onChange(ev);
  };

  renderOption = (option, i) => {
    const { value } = this.props;
    const { query, index } = this.state;

    const suggestionText = `${option.title}`;
    const matches = AutosuggestHighlightMatch(suggestionText, query);
    const parts = AutosuggestHighlightParse(suggestionText, matches);

    const className = classnames("option", {
      selected: option.id === value,
      highlighted: index === i
    });

    return (
      <div
        className={className}
        key={option.id}
        value={option.id}
        onClick={() => this.selectOption(option)}
      >
        {parts.map((part, index) => {
          const className = part.highlight ? "highlight" : null;

          return (
            <span className={className} key={index}>
              {part.text}
            </span>
          );
        })}
      </div>
    );
  };

  get styleList() {
    const { maxWidth } = this.props;

    return {
      maxWidth: maxWidth + "px"
    };
  }

  renderOptions() {
    const { empty } = this.i18n;

    if (this.options.length === 0) {
      return <div className="empty">{empty}</div>;
    }

    return this.options.map((option, i) => this.renderOption(option, i));
  }

  renderList() {
    const { open } = this.state;

    if (!open) return null;

    return (
      <div className="options" ref={this.overlay} style={this.style}>
        <div className="list" ref={this.list} style={this.styleList}>
          {this.renderOptions()}
        </div>
        {this.renderSearch()}
      </div>
    );
  }

  renderSearch() {
    const { query } = this.state;
    const { search } = this.i18n;

    if (!query) return null;

    return (
      <div className="search">
        {search} {query}
      </div>
    );
  }

  get style() {
    const { width } = this.state;

    return { minWidth: width + "px" };
  }

  calcWidth = () => {
    const { width } = this.state;

    if (width) return;

    if (this.overlay.current) {
      const box = this.overlay.current.getBoundingClientRect();
      this.setState({ width: box.width });
    }
  };

  toggleOpen = () => {
    let { open, query } = this.state;

    open = !open;

    if (open) {
      query = "";
    }

    this.setState({ open, query, index: -1 }, this.calcWidth);
  };

  render() {
    const { isRTL } = this.i18n;

    const className = classnames("Select-container", { rtl: isRTL });

    return (
      <div className={className} ref={this.container}>
        {this.renderPlaceholder()}
        {this.renderList()}
      </div>
    );
  }
}

export default Select;
