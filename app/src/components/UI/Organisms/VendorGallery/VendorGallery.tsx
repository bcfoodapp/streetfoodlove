import { Photo } from "../../../../api";
import React from "react";
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";
import { Image } from "semantic-ui-react";

interface Props {
  photos: Photo[];
}

/**
 * Vendor photo gallery
 */
export default ({ photos }: Props): React.ReactElement => {
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
        <Image.Group size="small">
          {photos.map((photo, i) => (
            <a
              href={`https://streetfoodlove.s3.us-west-2.amazonaws.com/${photo.ID}.jpg`}
            >
              <Image
                key={i}
                src={`https://streetfoodlove.s3.us-west-2.amazonaws.com/${photo.ID}.jpg`}
                alt={photo.Text}
              />
            </a>
          ))}
        </Image.Group>
      </SRLWrapper>
    </SimpleReactLightbox>
  );
};
