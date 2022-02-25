import React, { useRef, useState } from "react";
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
  const [recentSearchResult, setRecentSearchResult] = useState<Vendor[]>([]);
  const { data: vendorsList } = useVendorsQuery();
  const inputRef = useRef<any>(null);
  const dispatch = useAppDispatch();

  const enterQueryHandler = () => {
    let resultSet = new Set([
      inputRef.current.props.value,
      ...recentSearchResult,
    ]);

    let array: Vendor[] = [];

    if (vendorsList !== undefined) {
      for (const vendor of vendorsList) {
        if (
          vendor.Name === inputRef.current.props.value &&
          resultSet.has(vendor.Name)
        ) {
          let obj = {
            title: vendor.Name,
            description: vendor.BusinessAddress,
            ...vendor,
          };

          array.push(obj);
        }
      }
    }

    setRecentSearchResult([...array, ...recentSearchResult]);

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
      // console.log(condition);
      let resultArray: Vendor[] = [];

      let filteredResult = vendorsList.filter((element) => {
        //filter all vendors from vendors list who matches regex expression
        return condition.test(element.Name);
      });

      let recentSearchFilteredResult = recentSearchResult.filter((element) => {
        //filter all vendors from recent search who matches regex expr.
        return condition.test(element.Name);
      });

      // console.table(recentSearchFilteredResult);

      for (let i = 0; i < filteredResult.length; i++) {
        //loop through all vendors that pass the regex filter

        let tempObject = {
          title: filteredResult[i].Name,
          description: filteredResult[i].BusinessAddress,
          ...filteredResult[i],
        };

        if (
          //if the tempobject has no matches in recentsearch result, then push to the result array
          !recentSearchResult.some(
            (element) => element.Name === tempObject.title
          )
        ) {
          resultArray.push(tempObject);
        }
      }

      resultArray.unshift(...recentSearchFilteredResult); //add filtered recentsearchresult to the front of reusltarray
      setSearchResult(resultArray);
    }
  };

  return (
    <Menu.Item className={styles.searchBox}>
      <Search
        input={
          <Input
            icon={
              <Buttons enter color={"green"} clicked={enterQueryHandler}>
                Enter
              </Buttons>
            }
            placeholder="Search..."
            focus
            size={"small"}
            className={styles.inputBox}
            ref={inputRef}
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
