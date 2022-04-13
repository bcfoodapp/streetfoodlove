import React, { SyntheticEvent } from "react";
import { Dropdown } from "semantic-ui-react";
import { useAppDispatch } from "../../../../store/root";
import { setCuisineType } from "../../../../store/search";
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

const SelectFilter: React.FC<{}> = () => {
  const dispatch = useAppDispatch();

  return (
    <Dropdown
      placeholder="Cuisine Type"
      fluid
      multiple
      search
      selection
      options={options}
      className={styles.filter}
      onChange={(e, data) => dispatch(setCuisineType(data.value as string[]))}
    />
  );
};

export default SelectFilter;
