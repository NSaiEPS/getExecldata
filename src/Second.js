import React from "react";
import Third from "./Third";

function Second({ name }) {
  console.log(name, "second");

  return (
    <div>
      <Third name={name} />
    </div>
  );
}

export default Second;
