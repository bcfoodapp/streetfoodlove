import React, { useState } from "react";
import {
  Sidebar,
  Menu,
  Icon,
  Button,
  Checkbox,
  Container,
} from "semantic-ui-react";
import { hideSideBar, useAppDispatch, useAppSelector } from "../../../../store";
import SelectFilter from "../MultiSelectFilter/SelectFilter";
import styles from "./sidebar.module.css";
import { search } from "../../../../search";
import { useEffectAsync } from "../../../../api";

interface openSearchVendor {
  Name: string;
  BusinessAddress: string;
  Website: string;
  BusinessHours: string;
  Phone: string;
}

const LandingPageSidebar: React.FC = () => {
  const showSideBarState = useAppSelector((state) => state.root.sideBarShowing);
  const searchQuery = useAppSelector((state) => state.root.searchQuery);
  const [searchResult, setSearchResult] = useState([] as openSearchVendor[]);

  useEffectAsync(async () => {
    if (searchQuery) {
      const result = await search(searchQuery);
      setSearchResult(result.hits.hits.map(({ _source }) => _source));
    }
  }, [searchQuery]);

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
      {/* Temporary output */}
      <Container textAlign="left">
        {searchResult.map((row) => (
          <Container>
            <Container className={styles.vendorInfo}>
              <h2>{row.Name}</h2>
              <h4>Address: {row.BusinessAddress}</h4>
              <h4>Business Hours: {row.BusinessHours}</h4>
              <h4>Phone: {row.Phone}</h4>
              <h4>Website: {row.Website}</h4>
            </Container>
            <Container className={styles.divider} />
          </Container>
        ))}
      </Container>
    </Sidebar>
  );
};

export default LandingPageSidebar;
