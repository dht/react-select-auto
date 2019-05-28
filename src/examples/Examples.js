import React from "react";
import "./Examples.scss";
import Select from "../Select";
import dataEn from "./data/countries.en";
import dataCh from "./data/countries.ch";
import dataHe from "./data/countries.he";
import dataAr from "./data/countries.ar";

class Examples extends React.Component {
  state = {
    item: {}
  };

  onChange = ev => {
    const { item } = this.state;

    if (!item) return;

    const target = ev.target;
    const value = target.value;
    const name = target.name;

    item[name] = value;

    this.setState({ item });
  };

  render() {
    const { item } = this.state,
      { country } = item;

    return (
      <div className="Examples-container">
        <h2>English (ltr)</h2>
        <Select
          placeholder="Choose a country"
          options={dataEn}
          value={country}
          name="country"
          onChange={this.onChange}
        />
        <br />
        <h2>Chinese (ltr)</h2>
        <Select
          placeholder="选择国家"
          locale="ch"
          options={dataCh}
          value={country}
          name="country"
          onChange={this.onChange}
        />
        <br />
        <h2>Hebrew (rtl)</h2>
        <Select
          placeholder="בחר מדינה"
          locale="he"
          options={dataHe}
          value={country}
          name="country"
          onChange={this.onChange}
        />
        <br />
        <h2>Arabic (rtl)</h2>
        <Select
          placeholder="اختر الدولة"
          locale="ar"
          options={dataAr}
          value={country}
          name="country"
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default Examples;
