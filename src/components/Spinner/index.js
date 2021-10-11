import React from "react";

const Spinner = (props) => (
  <div class={`lds-ellipsis ${props.className ?? ""}`}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export default Spinner;
