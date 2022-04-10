import React, { SyntheticEvent } from "react";
import { Dropdown, DropdownProps } from "semantic-ui-react";
import styles from "./filter.module.css";

const options = [
  {
    key: "Mexican",
    text: "Mexican",
    value: "Mexican",
  },
  {
    key: "Indian",
    text: "Indian",
    value: "Indian",
  },
  {
    key: "Chinese",
    text: "Chinese",
    value: "Chinese",
  },
  {
    key: "Japanese",
    text: "Japanese",
    value: "Japanese",
  },
  {
    key: "French",
    text: "French",
    value: "French",
  },
  {
    key: "Spanish",
    text: "Spanish",
    value: "Spanish",
  },
  {
    key: "Thai",
    text: "Thai",
    value: "Thai",
  },
  {
    key: "Korean",
    text: "Korean",
    value: "Korean",
  },
];

const SelectFilter: React.FC<{
  addSelection: (e: SyntheticEvent<HTMLElement, Event>, value) => void;
  selections: string[];
}> = ({ addSelection, selections }) => {
  return (
    <Dropdown
      placeholder="Cuisine Type"
      fluid
      multiple
      search
      selection
      options={options}
      className={styles.filter}
      value={selections}
      onChange={(e, data) => addSelection(e, data.value)}
    />
  );
};

export default SelectFilter;
