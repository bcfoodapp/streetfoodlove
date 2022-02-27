import { Photo } from "../../../../api";
import React from "react";
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";
import { Container, Icon, Image } from "semantic-ui-react";
import styles from './gallery.module.css'

interface Props {
  photos: Photo[];
  // Displayed height of each photo
  photoHeight: number;
}

/**
 * Vendor photo gallery
 */
export default ({ photos, photoHeight }: Props): React.ReactElement => {
  return (
    <SimpleReactLightbox>
      <SRLWrapper
        options={{
          settings: {
            slideAnimationType: "slide",
          },
          buttons: {
            showAutoplayButton: false,
            showDownloadButton: false,
            showThumbnailsButton: false,
          },
          caption: {

          }
        }}
      >
        <Image.Group style={{position: "relative"}}>
          {photos.map((photo, i) => (
            <a
            href={`https://streetfoodlove.s3.us-west-2.amazonaws.com/${photo.ID}`}
            key={i}
            >
              <Container className={styles.shareTwitter}>
              </Container>
              <Image
                src={`https://streetfoodlove.s3.us-west-2.amazonaws.com/${photo.ID}`}
                alt={photo.Text}
                style={{
                  height: photoHeight,
                  margin: 0,
                  marginLeft: 2,
                  marginRight: 2,
                }}
              />
            </a>
          ))}
          <Icon name="twitter" size="large" color="blue" className={styles.icon}/>
        </Image.Group>
      </SRLWrapper>
    </SimpleReactLightbox>
  );
};
