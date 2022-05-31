import { Grid } from "semantic-ui-react";
import PopularCuisineComponent from "../../PopularCuisine";
import PopularSearchComponent from "../../PopularSearch";
import PopularVendorComponent from "../../PopularVendor";
import ReviewsChart from "../../ReviewsChart";
import AverageRatingComponent from "../../AverageRating";

const Analytics: React.FC = () => {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={8}>
          <PopularCuisineComponent />
        </Grid.Column>
        <Grid.Column width={8}>
          <PopularSearchComponent />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={8}>
          <PopularVendorComponent />
        </Grid.Column>
        <Grid.Column width={8}>
          <ReviewsChart />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={8}>
          <AverageRatingComponent />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Analytics;
