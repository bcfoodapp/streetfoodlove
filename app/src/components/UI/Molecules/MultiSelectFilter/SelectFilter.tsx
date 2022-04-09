import React from "react";
import { Dropdown } from "semantic-ui-react";
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
];

const SelectFilter: React.FC<{addSelection: (cuisine: string[]) => void, selections: string[]}> = ({ addSelection, selections }) => {
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
      // onChange={addSelection([...selections])}
    />
  );
};

export default SelectFilter;
