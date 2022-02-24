import { Photo } from "../../../../api";
import React from "react";
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";
import { Image } from "semantic-ui-react";

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
        }}
      >
        <Image.Group>
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
                  marginLeft: 2,
                  marginRight: 2,
                }}
              />
            </a>
          ))}
        </Image.Group>
      </SRLWrapper>
    </SimpleReactLightbox>
  );
};
