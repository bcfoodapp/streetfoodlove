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
import { hideSideBar } from "../../../../store/search";

const LandingPageSidebar: React.FC = () => {
  const [cuisineSelection, setCuisineSelection] = useState<string[]>([]);
  const [cheapSelection, setCheapSelection] = useState<boolean>(false);
  const [mediumSelection, setMediumSelection] = useState<boolean>(false);
  const [gourmetSelection, setGourmetSelection] = useState<boolean>(false);

  const showSideBarState = useAppSelector(
    (state) => state.search.sideBarShowing
  );

  const searchQuery = useAppSelector(({ search }) => search.searchQuery);
  const { data: resultVendors } = useSearchQuery(searchQuery!, {
    skip: !searchQuery,
  });

  const handleChange = (
    e: SyntheticEvent<HTMLElement, Event>,
    data: string[]
  ) => {
    setCuisineSelection([...data]);
  };

  const handleCheapSelectionChange = (
    e: React.FormEvent<HTMLInputElement>,
    data
  ) => {
    console.log("data: " + data);
    setCheapSelection(data);
  };

  const handleMediumSelectionChange = (
    e: React.FormEvent<HTMLInputElement>,
    data
  ) => {
    console.log("data: " + data);
    setMediumSelection(data);
  };

  const handleGourmetSelectionChange = (
    e: React.FormEvent<HTMLInputElement>,
    data
  ) => {
    console.log("data: " + data);
    setGourmetSelection(data);
  };

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

        <SelectFilter
          addSelection={handleChange}
          selections={cuisineSelection}
        />

        <h3 className={styles.header}>Prices</h3>
        <Checkbox
          label="Cheap"
          className={styles.checkbox}
          onChange={(e, data) => handleCheapSelectionChange(e, data.checked)}
        />

        <Checkbox
          label="Medium"
          className={styles.checkbox}
          onChange={(e, data) => handleMediumSelectionChange(e, data.checked)}
        />

        <Checkbox
          label="Gourmet"
          className={styles.checkbox}
          onChange={(e, data) => handleGourmetSelectionChange(e, data.checked)}
        />
      </Menu.Item>
      <Menu.Item>
        <h3 className={styles.header}>Results</h3>
      </Menu.Item>

      <Container textAlign="left">
        {resultVendors
          ? resultVendors.map((vendor) => {
              if (
                (cheapSelection && vendor["PriceRange"] === "Cheap") ||
                (mediumSelection && vendor["PriceRange"] === "Medium") ||
                (gourmetSelection && vendor["PriceRange"] === "Gourmet") ||
                (cheapSelection === false &&
                  mediumSelection === false &&
                  gourmetSelection === false)
              ) {
                if (cuisineSelection.length === 0) {
                  return (
                    <Container key={vendor.ID}>
                      <Container className={styles.vendorInfo}>
                        <h2>
                          <Link to={`/vendors/${vendor.ID}`}>
                            {vendor.Name}
                          </Link>
                        </h2>
                        <p>Address: {vendor.BusinessAddress}</p>
                        <p>Business Hours: {vendor.BusinessHours}</p>
                      </Container>
                      <Container className={styles.divider} />
                    </Container>
                  );
                } else {
                  for (const cuisine of vendor["Cuisine Types"]) {
                    if (cuisineSelection.includes(cuisine)) {
                      return (
                        <Container key={vendor.ID}>
                          <Container className={styles.vendorInfo}>
                            <h2>
                              <Link to={`/vendors/${vendor.ID}`}>
                                {vendor.Name}
                              </Link>
                            </h2>
                            <p>Address: {vendor.BusinessAddress}</p>
                            <p>Business Hours: {vendor.BusinessHours}</p>
                          </Container>
                          <Container className={styles.divider} />
                        </Container>
                      );
                    }
                  }
                }
              }
            })
          : null}
      </Container>
    </Sidebar>
  );
};

export default LandingPageSidebar;
