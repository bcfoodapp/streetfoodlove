import React, { ChangeEvent, SetStateAction, useState } from "react";
import {
  Container,
  Input,
  InputOnChangeData,
  Menu,
  Search,
  SearchProps,
} from "semantic-ui-react";
import styles from "./searchbox.module.css";
import Buttons from "../Button/Buttons";
import { useVendorsQuery, Vendor } from "../../../../api";
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
  />
);

export const SearchBox: React.FC = () => {
  const [searchResult, setSearchResult] = useState<Vendor[]>([]);
  const { data: vendorsList } = useVendorsQuery();

  const onSearchChange = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    data: SearchProps
  ) => {
    // setSearchValue(data.value as SetStateAction<string>);

    if (vendorsList) {
      for (let i = 0; i < vendorsList.length; i++) {
        if (data.value === vendorsList[i].Name) {
          let newResult = [...searchResult, vendorsList[i]];
          setSearchResult(newResult);
          console.log("found: " + JSON.stringify(vendorsList[i]));
        }
      }
    }

    // console.log(vendorsList);
  };

  const searchEnterHandler = () => {};
  //name, address, and picture

  return (
    <Menu.Item className={styles.searchBox}>
      <Search
        input={inputBox}
        size={"small"}
        onSearchChange={onSearchChange}
        results={[
          {
            title: searchResult[0]?.Name,
            description: searchResult[0]?.BusinessAddress,
          },
        ]}
      />
      {/* <Field>
        {({ form: {dirty, valid } }) => (
        )}
      </Field> */}
    </Menu.Item>
  );
};
