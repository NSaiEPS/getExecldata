import React from "react";
import Second from "./Second";

function First({ name }) {
  console.log(name, "first");
  return (
    <div>
      <Second name={name} />
    </div>
  );
}

export default First;
