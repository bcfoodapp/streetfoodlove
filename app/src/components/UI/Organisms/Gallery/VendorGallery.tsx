import React, { useEffect, useState } from "react";
import * as GalleryComponent from "react-grid-gallery";
import { Photo } from "../../../../api";
import { Segment } from "semantic-ui-react";

interface Props {
  photos: Photo[];
}

/**
 * Vendor photo gallery
 */
export default ({ photos }): React.ReactElement<Props> => {
  const [images, setImages] = useState([] as Record<string, any>[]);

  useEffect(() => {
    if (photos && images.length === 0) {
      setImages([]);
      for (const photo of photos) {
        const img = new Image();
        img.onload = () => {
          setImages((state) => [
            ...state,
            {
              src: `https://streetfoodlove.s3.us-west-2.amazonaws.com/${photo.ID}.jpg`,
              thumbnail: `https://streetfoodlove.s3.us-west-2.amazonaws.com/${photo.ID}.jpg`,
              thumbnailWidth: img.width,
              thumbnailHeight: img.height,
              alt: photo.Text,
            },
          ]);
        };
        img.src = `https://streetfoodlove.s3.us-west-2.amazonaws.com/${photo.ID}.jpg`;
      }
    }
  }, [photos]);

  return (
    <Segment style={{ height: 150 + 14 * 2 + 3 * 2, width: "100%" }}>
      <GalleryComponent
        images={images}
        rowHeight={150}
        enableImageSelection={false}
        maxRows={1}
      />
    </Segment>
  );
};
