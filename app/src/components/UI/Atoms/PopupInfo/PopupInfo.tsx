import React from "react";
import styles from './popupInfo.module.css'

/**
 * This component is for storing the vendor information in the popups that appear on the map
 */

export default function PopupInfo(): React.ReactElement {
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.vendorName}>
          <div>
            <span>McDonalds</span>
          </div>
          <div className={styles.firstImage}>
            <img src="https://media.istockphoto.com/vectors/five-stars-rating-vector-id925469766?k=20&m=925469766&s=170667a&w=0&h=Z-e1FuriS6-RmQ4YRuZbPxaWFEWm41D9fiTaNCQIGy4=" alt="cannot be displayed" />
          </div>
        </div>
        <div className={styles.secondImage}>
          <img src="https://saferchemicals.org/wp-content/uploads/2021/01/McDonalds-sign-scaled.jpeg" alt="cannot be displayed"/>
        </div>
      </div>
        <div className="sampleReviewWrap">
          <h3>Review By Colin Zhou</h3>
          <pre>
            This was the tastiest spot 
            that I've ever eaten at 
            for dinner!
          </pre>
        </div>
    </div>
  )
}