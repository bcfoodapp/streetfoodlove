import React, { SyntheticEvent, useState } from "react";
import {
  Sidebar,
  Menu,
  Icon,
  Button,
  Checkbox,
  Container,
  DropdownProps,
} from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "../../../../store/root";
import CuisineFilter from "../MultiSelectFilter/CuisineFilter";
import styles from "./sidebar.module.css";
import { useSearchQuery } from "../../../../api";
import { Link } from "react-router-dom";
import {
  hideSideBar,
  addPriceRange,
  deletePriceRangeFilter,
} from "../../../../store/search";

const LandingPageSidebar: React.FC = () => {
  const [cuisineSelection, setCuisineSelection] = useState<string[]>([]);

  const showSideBarState = useAppSelector(
    (state) => state.search.sideBarShowing
  );

  const searchQuery = useAppSelector(({ search }) => search.searchQuery);
  const cuisineTypeFilter = useAppSelector(({ search }) => search.cuisineType);
  const priceRangeFilter = useAppSelector(({ search }) => search.priceRange);

  let searchParams = {
    SearchString: searchQuery,
    CuisineType: cuisineTypeFilter,
    PriceRange: priceRangeFilter,
  };

  const { data: searchResult, isLoading: searchQueryIsLoading } =
    useSearchQuery(searchParams!, {
      skip: !searchQuery,
    });

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

        {searchQuery !== null ? (
          <CuisineFilter searchQuery={searchQuery} />
        ) : (
          <CuisineFilter />
        )}

        <h3 className={styles.header}>Prices</h3>
        <Checkbox
          label="cheap"
          className={styles.checkbox}
          onChange={(e, data) => {
            data.checked
              ? dispatch(addPriceRange(data.label as string))
              : dispatch(deletePriceRangeFilter());
          }}
        />

        <Checkbox
          label="medium"
          className={styles.checkbox}
          onChange={(e, data) => {
            data.checked
              ? dispatch(addPriceRange(data.label as string))
              : dispatch(deletePriceRangeFilter());
          }}
        />

        <Checkbox
          label="gourmet"
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
        {searchQueryIsLoading ? <p>Loading</p> : null}
        {searchResult
          ? searchResult.map((vendor) => {
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
