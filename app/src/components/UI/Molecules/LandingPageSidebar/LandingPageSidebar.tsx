import React from "react";
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
import { hideSideBar } from "../../../../store/search";

const LandingPageSidebar: React.FC = () => {
  const showSideBarState = useAppSelector(
    (state) => state.search.sideBarShowing
  );
  const searchQuery = useAppSelector((state) => state.search.searchQuery);
  const { data: resultVendors } = useSearchQuery(searchQuery!, {
    skip: !searchQuery,
  });

  const dispatch = useAppDispatch();

  const closeSidebar = () => {
    dispatch(hideSideBar());
  };

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
      <Button icon onClick={closeSidebar} className={styles.closeIcon}>
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
        <Checkbox label="0~5$" className={styles.checkbox} />
        <Checkbox label="5~10$" className={styles.checkbox} />
        <Checkbox label="10~15$" className={styles.checkbox} />
        <Checkbox label="20+$" className={styles.checkbox} />
      </Menu.Item>
      <Menu.Item>
        <h3 className={styles.header}>Results</h3>
      </Menu.Item>
      <Container textAlign="left">
        {resultVendors
          ? resultVendors.map((vendor) => (
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
            ))
          : null}
      </Container>
    </Sidebar>
  );
};

export default LandingPageSidebar;
