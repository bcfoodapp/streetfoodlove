import { Photo } from "../../../../api";
import React from "react";
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";
import { Image, Segment } from "semantic-ui-react";

interface Props {
  photos: Photo[];
}

/**
 * Vendor photo gallery
 */
export default ({ photos }: Props): React.ReactElement => {
  return (
    <Segment style={{ width: "100%" }}>
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
                href={`https://streetfoodlove.s3.us-west-2.amazonaws.com/${photo.ID}.jpg`}
                key={i}
              >
                <Image
                  src={`https://streetfoodlove.s3.us-west-2.amazonaws.com/${photo.ID}.jpg`}
                  alt={photo.Text}
                  style={{
                    height: 150,
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
    </Segment>
  );
};
