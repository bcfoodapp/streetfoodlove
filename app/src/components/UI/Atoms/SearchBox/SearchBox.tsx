import React, { useState } from "react";
import { Input, Menu, Search, SearchProps } from "semantic-ui-react";
import styles from "./searchbox.module.css";
import Buttons from "../Button/Buttons";
import { useVendorsQuery, Vendor } from "../../../../api";
import { Field } from "formik";
import { useAppDispatch } from "../../../../store";
import { showSideBar } from "../../../../store";

/**
 * This is the searchbox for the header
 */

export const SearchBox: React.FC = () => {
  const [searchResult, setSearchResult] = useState<Vendor[]>([]);
  const { data: vendorsList } = useVendorsQuery();
  const dispatch = useAppDispatch();

  const openSideBar = () => {
    dispatch(showSideBar());
  };

  const onSearchChange = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    data: SearchProps
  ) => {
    if (data.value?.length === 0) {
      setSearchResult([]);
      return;
    }

    if (vendorsList) {
      let search = data.value;
      let condition = new RegExp(search as string);

      let result = vendorsList.filter((element) => {
        return condition.test(element.Name);
      });

      let resultArray: Vendor[] = [];

      for (let obj of result) {
        let tempObject = {
          title: obj.Name,
          description: obj.BusinessAddress,
          ...obj,
        };

        resultArray.push(tempObject);
      }

      setSearchResult(resultArray);
    }
  };

  return (
    <Menu.Item className={styles.searchBox}>
      <Search
        input={
          <Input
            icon={
              <Buttons enter color={"green"} clicked={openSideBar}>
                Enter
              </Buttons>
            }
            placeholder="Search..."
            focus
            size={"small"}
            className={styles.inputBox}
          />
        }
        size={"small"}
        onSearchChange={onSearchChange}
        results={searchResult}
        showNoResults
      />
      {/* <Field>
        {({ form: {dirty, valid } }) => (
        )}
      </Field> */}
    </Menu.Item>
  );
};
