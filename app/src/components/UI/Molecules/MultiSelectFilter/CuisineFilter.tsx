import React from "react";
import { Dropdown } from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "../../../../store/root";
import {
  getUserIDFromToken,
  useCreatePastSearchMutation,
} from "../../../../api";
import { setCuisineType } from "../../../../store/search";
import styles from "./filter.module.css";
import { v4 as uuid } from "uuid";

const options = [
  {
    key: "Mexican",
    text: "Mexican",
    value: "mexican",
  },
  {
    key: "Indian",
    text: "Indian",
    value: "indian",
  },
  {
    key: "Chinese",
    text: "Chinese",
    value: "chinese",
  },
  {
    key: "Japanese",
    text: "Japanese",
    value: "japanese",
  },
  {
    key: "French",
    text: "French",
    value: "french",
  },
  {
    key: "Spanish",
    text: "Spanish",
    value: "spanish",
  },
  {
    key: "Thai",
    text: "Thai",
    value: "thai",
  },
  {
    key: "Korean",
    text: "Korean",
    value: "korean",
  },
  {
    key: "Italian",
    text: "Italian",
    value: "italian",
  },
];

interface Props {
  searchQuery?: string;
}

const CuisineFilter: React.FC<Props> = ({ searchQuery }) => {
  const dispatch = useAppDispatch();
  const [createPastSearch] = useCreatePastSearchMutation();
  const token = useAppSelector((state) => state.token.token);

  let userID = null as string | null;
  if (token) {
    userID = getUserIDFromToken(token);
  }

  return (
    <Dropdown
      placeholder="Cuisine Type"
      fluid
      multiple
      search
      selection
      options={options}
      className={styles.filter}
      onChange={(e, data) => {
        dispatch(setCuisineType(data.value as string[]));
        let relevantWord = searchQuery?.split(" ").pop();

        if (relevantWord && userID) {
          createPastSearch({
            ID: uuid(),
            UserID: userID,
            RelevantSearchWord: relevantWord,
            CuisineTypes: (data.value as string[]).join(" "),
          });
        }
      }}
    />
  );
};

export default CuisineFilter;
