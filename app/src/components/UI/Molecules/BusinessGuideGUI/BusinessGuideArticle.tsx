import { Container, Header } from "semantic-ui-react";
import HeaderBar from "../HeaderBar/HeaderBar";
import styles from "./article.module.css";
import { useGuideQuery } from "../../../../api";
import { useParams } from "react-router-dom";

const BusinessGuideArticle: React.FC = () => {
  const guideID = useParams().ID as string;
  const { data: guideInfo } = useGuideQuery(guideID);

  return (
    <Container className={styles.wrapper}>
      <HeaderBar logout />
      <Header as="h2" className={styles.header}>
        {" "}
        Guide{" "}
      </Header>
      <Container className={styles.postInfo}>
        <Container>
          <Header as="h3" className={styles.postDate}>
            Post date:{" " + guideInfo?.DatePosted}
          </Header>
        </Container>
        <Container>
          <Header as="h4" className={styles.author}>
            Author:{" " + guideInfo?.ArticleAuthor}
          </Header>
        </Container>
      </Container>
      <Container text>{guideInfo?.Guide}</Container>
    </Container>
  );
};

export default BusinessGuideArticle;
