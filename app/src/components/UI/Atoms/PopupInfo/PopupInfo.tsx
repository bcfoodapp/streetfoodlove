import React from "react";
import styles from "./popupInfo.module.css";
import { usePhotosByLinkIDQuery, Vendor } from "../../../../api";
import { Link } from "react-router-dom";
import { Container, Image } from "semantic-ui-react";
import { s3Prefix } from "../../../../aws";

interface Props {
  vendor: Vendor;
}

/**
 * This component is for storing the vendor information in the popups that appear on the map
 */
export default function PopupInfo({ vendor }: Props): React.ReactElement {
  const { data: photos } = usePhotosByLinkIDQuery(vendor.ID);

  return (
    <>
      <Container className={styles.header}>
        <Container className={styles.title}>
          <Link to={`/vendors/${vendor.ID}`}>{vendor.Name}</Link>
        </Container>
      </Container>
      {photos && photos.length > 0 ? (
        <Image
          src={s3Prefix + photos[0].ID}
          alt={photos[0].Text}
          style={{ height: 200 }}
        />
      ) : null}
    </>
  );
}
