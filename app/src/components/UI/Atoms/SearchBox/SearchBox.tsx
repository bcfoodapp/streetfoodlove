import React, { useState } from "react";
import { Form, Input, Menu, Search, SearchProps } from "semantic-ui-react";
import styles from "./searchbox.module.css";
import {
  getUserIDFromToken,
  useCreateQueryMutation,
  useCreatePastSearchMutation,
  useGetTokenMutation,
  useVendorsQuery,
  Vendor,
} from "../../../../api";
import { useAppDispatch } from "../../../../store/root";
import { setSearchQuery, showSideBar } from "../../../../store/search";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";

/**
 * This is the searchbox for the header
 */

export const SearchBox: React.FC = () => {
  const [searchResult, setSearchResult] = useState<Vendor[]>([]);
  const [recentSearchResult, setRecentSearchResult] = useState<Vendor[]>([]);
  const [searchString, setSearchString] = useState("");
  const { data: vendorsList } = useVendorsQuery();
  const dispatch = useAppDispatch();
  const [getToken] = useGetTokenMutation();
  const [createQuery] = useCreateQueryMutation();
  const [createPastSearch] = useCreatePastSearchMutation();

  const enterQueryHandler = async () => {
    let resultSet = new Set([searchString, ...recentSearchResult]);

    let array: Vendor[] = [];

    if (vendorsList) {
      for (const vendor of vendorsList) {
        if (
          vendor.Name === searchString &&
          resultSet.has(vendor.Name) &&
          !recentSearchResult.some((item) => item.Name === searchString)
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

    const tokenResponse = await getToken();
    if ("data" in tokenResponse && tokenResponse.data) {
      const query = {
        ID: uuid(),
        UserID: getUserIDFromToken(tokenResponse.data),
        QueryText: searchString,
        DateRequested: DateTime.now(),
      };
      await createQuery(query);

      let relevantWord = searchString.split(" ").pop()!;
      createPastSearch({
        ID: uuid(),
        UserID: getUserIDFromToken(tokenResponse.data),
        RelevantSearchWord: relevantWord,
        CuisineTypes: "",
      });
      console.log("finished");
      dispatch(setSearchQuery(searchString));
    }
  };

  const onSearchChange = (
    event: React.MouseEvent<HTMLElement>,
    data: SearchProps
  ) => {
    let string = "";
    if (data.value) {
      string = data.value;
    } else if (data.result && data.result.title) {
      string = data.result.title;
    }
    setSearchString(string);

    if (string.length === 0) {
      setSearchResult([]);
      return;
    }

    if (vendorsList) {
      string = string.toLowerCase();

      let condition = new RegExp(string);
      let resultArray: Vendor[] = [];

      let filteredResult = vendorsList.filter((element) => {
        //filter all vendors from vendors list who matches regex expression
        return condition.test(element.Name.toLowerCase());
      });

      let recentSearchFilteredResult = recentSearchResult.filter((element) => {
        //filter all vendors from recent search who matches regex expr.
        return condition.test(element.Name.toLowerCase());
      });

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
            (element) => element.Name.toLowerCase() === tempObject.title.toLowerCase()
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
      <Form onSubmit={enterQueryHandler}>
        <Search
          input={
            <Input placeholder="Search..." focus className={styles.inputBox} />
          }
          onSearchChange={onSearchChange}
          onResultSelect={onSearchChange}
          results={searchResult}
          showNoResults
        />
      </Form>
    </Menu.Item>
  );
};
