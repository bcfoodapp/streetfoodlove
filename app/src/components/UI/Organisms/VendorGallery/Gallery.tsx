import { Photo } from "../../../../api";
import React from "react";
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";
import { Container, Icon, Image } from "semantic-ui-react";

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
          caption: {},
        }}
      >
        <Image.Group style={{ whiteSpace: "nowrap", overflowX: "auto" }}>
          {photos.map((photo, i) => (
            <a
              href={`https://streetfoodlove.s3.us-west-2.amazonaws.com/${photo.ID}`}
              key={i}
            >
              <Image
                src={`https://streetfoodlove.s3.us-west-2.amazonaws.com/${photo.ID}`}
                alt={photo.Text}
                style={{
                  height: photoHeight,
                  margin: 0,
                  marginLeft: photoHeight / 30,
                  marginRight: photoHeight / 30,
                }}
              />
            </a>
          ))}
        </Image.Group>
      </SRLWrapper>
    </SimpleReactLightbox>
  );
};
