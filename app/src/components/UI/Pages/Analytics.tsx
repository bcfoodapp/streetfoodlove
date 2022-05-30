import { Grid } from "semantic-ui-react";
import PopularCuisine from "../../PopularCuisine";
import PopularSearch from "../../PopularSearch";
import PopularVendor from "../../PopularVendor";
import ReviewsChart from "../../ReviewsChart";
import AverageRating from "../../AverageRating";

const Analytics: React.FC = () => {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={8}>
          <PopularCuisine />
        </Grid.Column>
        <Grid.Column width={8}>
          <PopularSearch />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={8}>
          <PopularVendor />
        </Grid.Column>
        <Grid.Column width={8}>
          <ReviewsChart />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={8}>
          <AverageRating />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Analytics;
