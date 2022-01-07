import { Container } from "semantic-ui-react";

export const FinalStarRating = () => {
  return (
    <Container>
      <input type="radio" id="star5" name="rate" value="5" />
      <label htmlFor="star5" title="text">
        5 stars
      </label>
      <input type="radio" id="star4" name="rate" value="4" />
      <label htmlFor="star4" title="text">
        4 stars
      </label>
      <input type="radio" id="star3" name="rate" value="3" />
      <label htmlFor="star3" title="text">
        3 stars
      </label>
      <input type="radio" id="star2" name="rate" value="2" />
      <label htmlFor="star2" title="text">
        2 stars
      </label>
      <input type="radio" id="star1" name="rate" value="1" />
      <label htmlFor="star1" title="text">
        1 star
      </label>
    </Container>
  );
};
