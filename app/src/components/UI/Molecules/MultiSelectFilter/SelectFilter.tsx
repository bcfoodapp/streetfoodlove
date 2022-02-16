import React from "react";
import { Dropdown } from "semantic-ui-react";

const options = [
  {
    key: "Filter1",
    text: "Filter1",
    value: "Filter1",
  },
];

const SelectFilter: React.FC = () => {
  return (
    <Dropdown
      placeholder="State"
      fluid
      multiple
      search
      selection
      options={options}
    />
  );
};

export default SelectFilter;
