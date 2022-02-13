import React, { ChangeEvent, useState } from "react";
import {
  Container,
  Input,
  InputOnChangeData,
  Menu,
  Search,
} from "semantic-ui-react";
import styles from "./searchbox.module.css";
import Buttons from "../Button/Buttons";
import { Field } from "formik";

/**
 * This is the searchbox for the header
 */

const inputBox = (
  <Input
    icon={
      <Buttons enter color={"green"}>
        Enter
      </Buttons>
    }
    placeholder="Search..."
    focus
    size={"small"}
    className={styles.inputBox}
    // fluid
    // onChange={onChange}
    // value={searchValue}
  />
);

export const SearchBox: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");

  const onChange = (
    e: ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => {
    setSearchValue(data.value);
  };

  const searchEnterHandler = () => {};

  return (
    <Menu.Item className={styles.searchBox}>
      <Search input={inputBox} size={"small"} />
      {/* <Field>
        {({ form: {dirty, valid } }) => (
        )}
      </Field> */}
    </Menu.Item>
  );
};
