import React, { SyntheticEvent, useState } from "react";
import {
  Sidebar,
  Menu,
  Icon,
  Button,
  Checkbox,
  Container,
} from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "../../../../store/root";
import SelectFilter from "../MultiSelectFilter/SelectFilter";
import styles from "./sidebar.module.css";
import { useSearchQuery } from "../../../../api";
import { Link } from "react-router-dom";
import {
  hideSideBar,
  addPriceRange,
  deletePriceRangeFilter,
} from "../../../../store/search";

const LandingPageSidebar: React.FC = () => {
  const showSideBarState = useAppSelector(
    (state) => state.search.sideBarShowing
  );

  const searchQuery = useAppSelector(({ search }) => search.searchQuery);
  const cuisineTypeFilter = useAppSelector(({ search }) => search.cuisineType);
  const priceRangeFilter = useAppSelector(({ search }) => search.searchQuery);

  const { data: resultVendors } = useSearchQuery(searchQuery!, {
    skip: !searchQuery,
  });

  console.log(resultVendors);

  const dispatch = useAppDispatch();

  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      inverted
      vertical
      visible={showSideBarState}
      width="very wide"
      className={styles.sidebar}
    >
      <Button
        icon
        onClick={() => dispatch(hideSideBar())}
        className={styles.closeIcon}
      >
        <Icon name="close" size="big" color="grey" />
      </Button>
      <Menu.Item as="div" className={styles.menuItem}>
        <Icon
          name="caret down"
          size="big"
          color="black"
          className={styles.downIcon}
        />
        <h3 className={styles.header}>Filters</h3>
        <h3 className={styles.header}>Cuisine</h3>

        <SelectFilter />

        <h3 className={styles.header}>Prices</h3>
        <Checkbox
          label="Cheap"
          className={styles.checkbox}
          onChange={(e, data) => {
            data.checked
              ? dispatch(addPriceRange(data.label as string))
              : dispatch(deletePriceRangeFilter());
          }}
        />

        <Checkbox
          label="Medium"
          className={styles.checkbox}
          onChange={(e, data) => {
            data.checked
              ? dispatch(addPriceRange(data.label as string))
              : dispatch(deletePriceRangeFilter());
          }}
        />

        <Checkbox
          label="Gourmet"
          className={styles.checkbox}
          onChange={(e, data) => {
            data.checked
              ? dispatch(addPriceRange(data.label as string))
              : dispatch(deletePriceRangeFilter());
          }}
        />
      </Menu.Item>
      <Menu.Item>
        <h3 className={styles.header}>Results</h3>
      </Menu.Item>

      <Container textAlign="left">
        {resultVendors
          ? resultVendors.map((vendor) => {
              return (
                <Container key={vendor.ID}>
                  <Container className={styles.vendorInfo}>
                    <h2>
                      <Link to={`/vendors/${vendor.ID}`}>{vendor.Name}</Link>
                    </h2>
                    <p>Address: {vendor.BusinessAddress}</p>
                    <p>Business Hours: {vendor.BusinessHours}</p>
                  </Container>
                  <Container className={styles.divider} />
                </Container>
              );
            })
          : null}
      </Container>
    </Sidebar>
  );
};

export default LandingPageSidebar;

// GET _search
// {
//  "query": {
//  "bool": {
//  "must": [
//  {
//  "match": {
//  "text_entry": "Bellevue"
//  }
//  }
//  ],
//  "should": [
//  {
//  "match": {
//  "text_entry": "Korean"
//  }
//  }
//  ],
//  "minimum_should_match": 1,
//  "must_not": [
//  {
//  "match": {
//  "PriceRange": "Gourmet"
//  }
//  ],
//  "filter": {
//  "term": {
//  "Cuisine Type": "Cheap"
//  }
//  }
//  }
// } 

