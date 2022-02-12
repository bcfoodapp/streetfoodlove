import React, { ChangeEvent, useState } from "react";
import { Container, Input, InputOnChangeData, Menu } from "semantic-ui-react";
import styles from "./searchbox.module.css";
import Buttons from "../Button/Buttons";
import { Field } from "formik";

/**
 * This is the searchbox for the header
 */

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
      <Field>
        {({ form: {dirty, valid } }) => (
          <Input
            icon={
              <Buttons enter color={"green"} clicked={searchEnterHandler} dirty={dirty} valid={valid}>
                Enter
              </Buttons>
            }
            placeholder="Search..."
            focus
            onChange={onChange}
            value={searchValue}
          />
        )}
      </Field>
    </Menu.Item>
  );
};
