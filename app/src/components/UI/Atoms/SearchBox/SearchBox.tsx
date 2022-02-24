import React, { useRef, useState } from "react";
import {
  Input,
  InputProps,
  Menu,
  Search,
  SearchProps,
} from "semantic-ui-react";
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
  const [recentSearchResult, setRecentSearchResult] = useState<string[]>([]);
  const { data: vendorsList } = useVendorsQuery();
  const inputRef = useRef<any>(null);
  const dispatch = useAppDispatch();

  console.log("search result: " + JSON.stringify(searchResult, null, 2));

  const enterQueryHandler = () => {
    let resultSet = new Set([
      inputRef.current.props.value,
      ...recentSearchResult,
    ]);
    setRecentSearchResult([...resultSet]);

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
      let resultArray: Vendor[] = [];

      let filteredResult = vendorsList.filter((element) => {
        return condition.test(element.Name);
      });

      for (let i = 0; i < filteredResult.length; i++) {
        //loop through all vendors that pass the regex filter

        let tempObject = {
          title: filteredResult[i].Name,
          description: filteredResult[i].BusinessAddress,
          ...filteredResult[i],
        };
        // resultArray.unshift(tempObject);
        // for (const name of recentSearchResult) {
        //   if (name === tempObject.title) {
        //     resultArray = [tempObject, ...resultArray];
        //   }
        // }

        if (recentSearchResult.includes(tempObject.title)) {
          // console.log('item to be put in front is: ' + tempObject.Name);
          // console.log('amazing');
          // result.unshift(result.splice(i, 1)[0])
          resultArray.unshift(tempObject);
          // console.log(resultArray);
          // console.log('first element in result array is: ' + JSON.stringify(resultArray[0], null, 2));
          // console.log(resultArray[1]);
        } else {
          resultArray.push(tempObject);
        }
      }

      // console.log("resultArray: " + JSON.stringify(resultArray, null, 2));
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
