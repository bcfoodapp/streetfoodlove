import { Container, Divider, Header } from "semantic-ui-react";
import styles from "./article.module.css";
import { useGuideQuery } from "../../../../api";
import { useParams } from "react-router-dom";

const BusinessGuideArticle: React.FC = () => {
  const id = useParams().ID as string;
  const { data: guide } = useGuideQuery(id);

  return (
    <Container className={styles.wrapper}>
      <Divider hidden />
      <Header as="h2" className={styles.header}>
        {guide?.Title}
      </Header>
      <Divider hidden />
      <Container text>
        <Header as="h3" className={styles.postDate}>
          Post date: {guide?.DatePosted.toLocaleString()}
          <br />
          Author: {guide?.ArticleAuthor}
        </Header>
        <p style={{ whiteSpace: "pre-wrap" }}>{guide?.Guide}</p>
      </Container>
    </Container>
  );
};

export default BusinessGuideArticle;
