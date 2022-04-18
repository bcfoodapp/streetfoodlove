import React, { SyntheticEvent } from "react";
import { Dropdown } from "semantic-ui-react";
import { useAppDispatch } from "../../../../store/root";
import { setCuisineType } from "../../../../store/search";
import styles from "./filter.module.css";

const options = [
  {
    key: "Mexican",
    text: "Mexican",
    value: "mexican",
  },
  {
    key: "Indian",
    text: "Indian",
    value: "indian",
  },
  {
    key: "Chinese",
    text: "Chinese",
    value: "chinese",
  },
  {
    key: "Japanese",
    text: "Japanese",
    value: "japanese",
  },
  {
    key: "French",
    text: "French",
    value: "french",
  },
  {
    key: "Spanish",
    text: "Spanish",
    value: "spanish",
  },
  {
    key: "Thai",
    text: "Thai",
    value: "thai",
  },
  {
    key: "Korean",
    text: "Korean",
    value: "korean",
  },
  {
    key: "Italian",
    text: "Italian",
    value: "italian",
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
