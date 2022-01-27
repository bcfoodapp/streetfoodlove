import { Container, Header } from "semantic-ui-react";
import HeaderBar from "../HeaderBar/HeaderBar";
import styles from "./article.module.css";
import { useGuideQuery } from "../../../../api";
import { useParams } from "react-router-dom";

const BusinessGuideArticle: React.FC = () => {
  const guideID = useParams().ID as string
  const { data: guideInfo } = useGuideQuery(guideID)

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
            Post date:{guideInfo?.DatePosted}
          </Header>
        </Container>
        <Container>
          <Header as="h4" className={styles.author}>
            Author:{guideInfo?.ArticleAuthor}
          </Header>
        </Container>
      </Container>
      <Container text>
        {guideInfo?.Guide}
        {/* <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
          commodo ligula eget dolor. Aenean massa strong. Cum sociis natoque
          penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
          Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
          aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut,
          imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede link
          mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum
          semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula,
          porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante,
          dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla
          ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam
          ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
          commodo ligula eget dolor. Aenean massa strong. Cum sociis natoque
          penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
          Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
          aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut,
          imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede link
          mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum
          semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula,
          porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante,
          dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla
          ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam
          ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
        </p> */}
      </Container>
    </Container>
  );
};

export default BusinessGuideArticle;
