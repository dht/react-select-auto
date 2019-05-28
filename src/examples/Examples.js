import React from "react";
import "./Examples.scss";
import Select from "../Select";
import data from "./data/lofs";
import dataRtl from "./data/lofs.rtl";

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
      { lofId, lofRtlId } = item;

    return (
      <div className="Examples-container">
        <Select
          placeholder="lofs"
          options={Object.values(data)}
          value={lofId}
          name="lofId"
          onChange={this.onChange}
        />
        <br />
        <Select
          placeholder="כשללים"
          locale="he"
          options={Object.values(dataRtl)}
          value={lofRtlId}
          name="lofRtlId"
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default Examples;
