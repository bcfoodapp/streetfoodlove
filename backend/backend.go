package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/sts/types"
	"github.com/bcfoodapp/streetfoodlove/database"
	"github.com/bcfoodapp/streetfoodlove/uuid"
)

// Backend handles the application logic.
// Any method that contains "userID uuid.UUID" as the first parameter means it is
// password-protected. This means that method should first check if that user has access rights
// before executing the command.
type Backend struct {
	Database *database.Database
	AWS      *AWS
}

func (b *Backend) Close() error {
	return b.Database.Close()
}

var unauthorized = fmt.Errorf(
	"you are unauthorized to perform this action; make sure you are logged into the correct account",
)

// Vendors returns all vendors.
func (b *Backend) Vendors() ([]database.Vendor, error) {
	return b.Database.Vendors()
}

func (b *Backend) Vendor(id uuid.UUID) (*database.Vendor, error) {
	return b.Database.Vendor(id)
}

func (b *Backend) VendorCreate(userID uuid.UUID, vendor *database.Vendor) error {
	user, err := b.Database.User(userID)
	if err != nil {
		return err
	}

	if user.UserType != database.UserTypeVendor {
		return fmt.Errorf("you are not a vendor user type; only vendor users can create a vendor page")
	}

	if userID != vendor.Owner {
		return fmt.Errorf("owner field does not match userID")
	}

	_, err = b.Database.VendorByOwnerID(userID)
	// Check that vendor for owner does not exist. We are expecting sql.ErrNoRows if there is no
	// owner.
	if err == nil {
		return fmt.Errorf("you already have a vendor; each user may only be associated with up to one vendor")
	}

	if !errors.Is(err, sql.ErrNoRows) {
		return err
	}

	return b.Database.VendorCreate(vendor)
}

func (b *Backend) VendorUpdate(userID uuid.UUID, vendor *database.Vendor) error {
	if userID != vendor.Owner {
		return unauthorized
	}

	return b.Database.VendorUpdate(vendor)
}

func (b *Backend) VendorByOwnerID(userID uuid.UUID) (*database.Vendor, error) {
	return b.Database.VendorByOwnerID(userID)
}

func (b *Backend) User(id uuid.UUID) (*database.User, error) {
	userProtected, err := b.Database.User(id)
	if err != nil {
		return nil, err
	}
	return userProtected.User, nil
}

func (b *Backend) UserProtected(userID uuid.UUID, id uuid.UUID) (*database.UserProtected, error) {
	if userID != id {
		return nil, unauthorized
	}

	return b.Database.User(id)
}

func (b *Backend) UserProtectedUpdate(userID uuid.UUID, user *database.UserProtected) error {
	if userID != user.ID {
		return unauthorized
	}

	user.SignUpDate = time.Now()

	return b.Database.UserUpdate(user)
}

func (b *Backend) UserProtectedCreate(user *database.UserProtected, password string) error {
	user.SignUpDate = time.Now()

	return b.Database.UserCreate(user, password)
}

// UserS3Credentials returns temporary credentials which can be used to upload photos to the
// streetfoodlove S3 bucket.
func (b *Backend) UserS3Credentials(ctx context.Context, userID uuid.UUID) (*types.Credentials, error) {
	// Check if user exists
	if _, err := b.Database.User(userID); err != nil {
		return nil, err
	}

	return b.AWS.GetS3Role(ctx)
}

// UserLocationRole returns temporary credentials which allows access to the Location service.
func (b *Backend) UserLocationRole(ctx context.Context, userID uuid.UUID) (*types.Credentials, error) {
	if _, err := b.Database.User(userID); err != nil {
		return nil, err
	}

	return b.AWS.GetLocationRole(ctx)
}

func (b *Backend) Review(id uuid.UUID) (*database.Review, error) {
	return b.Database.Review(id)
}

type ReviewCreateResponse struct {
	DiscountCreated bool
}

func ContainsVendor(discounts []database.Discount, vendorID uuid.UUID) bool {
	for _, discount := range discounts {
		if discount.VendorID == vendorID {
			return true
		}
	}
	return false
}

func (b *Backend) ReviewCreate(userID uuid.UUID, review *database.Review) (*ReviewCreateResponse, error) {
	if review.UserID != userID {
		return nil, unauthorized
	}

	review.DatePosted = time.Now()

	if err := b.Database.ReviewCreate(review); err != nil {
		return nil, err
	}

	// Create discount if discount exchange is enabled
	vendor, err := b.Database.Vendor(review.VendorID)
	if err != nil {
		return nil, err
	}

	discountCreated := false
	if vendor.DiscountEnabled && review.ReplyTo == nil {
		discounts, err := b.Database.DiscountsByUser(review.UserID)
		if err != nil {
			return nil, err
		}

		if !ContainsVendor(discounts, review.VendorID) {
			discount := &database.Discount{
				ID:       uuid.New(),
				UserID:   review.UserID,
				VendorID: review.VendorID,
				Secret:   uuid.New(),
			}
			if err := b.Database.DiscountCreate(discount); err != nil {
				return nil, err
			}
			discountCreated = true
		}
	}

	return &ReviewCreateResponse{DiscountCreated: discountCreated}, nil
}

func (b *Backend) ReviewUpdate(userID uuid.UUID, review *database.Review) error {
	if review.UserID != userID {
		return unauthorized
	}

	return b.Database.ReviewUpdate(review)
}

func (b *Backend) ReviewsByVendorID(vendorID uuid.UUID) ([]database.Review, error) {
	return b.Database.ReviewsByVendorID(vendorID)
}

func (b *Backend) ReviewsPostedAfterReview(vendorID uuid.UUID, afterReview uuid.UUID) ([]database.Review, error) {
	lastSeenReview, err := b.Database.Review(afterReview)
	if err != nil {
		return nil, err
	}

	vendorReviews, err := b.Database.ReviewsByVendorID(vendorID)
	if err != nil {
		return nil, err
	}

	return selectReviewsAfterTime(vendorReviews, lastSeenReview.DatePosted), nil
}

func selectReviewsAfterTime(reviews []database.Review, afterTime time.Time) []database.Review {
	result := make([]database.Review, 0)
	for _, review := range reviews {
		if review.DatePosted.After(afterTime) {
			result = append(result, review)
		}
	}
	return result
}

func (b *Backend) VendorsByCoordinateBounds(bounds *database.CoordinateBounds) ([]uuid.UUID, error) {
	vendors, err := b.Database.VendorsByCoordinateBounds(bounds)
	if err != nil {
		return nil, err
	}

	result := make([]uuid.UUID, 0)
	for _, vendor := range vendors {
		result = append(result, vendor.ID)
	}
	return result, nil
}

func (b *Backend) PhotosByLinkID(linkID uuid.UUID) ([]database.Photo, error) {
	return b.Database.PhotosByLinkID(linkID)
}

func (b *Backend) Photo(id uuid.UUID) (*database.Photo, error) {
	return b.Database.Photo(id)
}

func (b *Backend) PhotoCreate(userID uuid.UUID, photo *database.Photo) error {
	// Check that the referenced record belongs to the user
	owner, err := b.Database.GetOwnerOfLink(photo.LinkID)
	if err != nil {
		return err
	}
	if owner != userID {
		return unauthorized
	}

	photo.DatePosted = time.Now()

	return b.Database.PhotoCreate(photo)
}

func (b *Backend) Guides() ([]database.Guide, error) {
	return b.Database.Guides()
}

func (b *Backend) Guide(id uuid.UUID) (*database.Guide, error) {
	return b.Database.Guide(id)
}

func (b *Backend) Link(id uuid.UUID) (*database.Link, error) {
	return b.Database.Link(id)
}

//Favorite
func (b *Backend) Favorite(id uuid.UUID) (*database.Favorite, error) {
	return b.Database.Favorite(id)
}

func (b *Backend) FavoriteCreate(userID uuid.UUID, favorite *database.Favorite) error {
	if favorite.UserID != userID {
		return unauthorized
	}

	favorite.DatePosted = time.Now()

	return b.Database.FavoriteCreate(favorite)
}

//Star
func (b *Backend) StarCreate(userID uuid.UUID, star *database.Star) error {
	if star.UserID != userID {
		return unauthorized
	}

	return b.Database.StarCreate(star)
}

func (b *Backend) StarsByUserID(userID uuid.UUID) ([]database.Star, error) {
	return b.Database.StarsByUserID(userID)
}

func (b *Backend) Star(userID uuid.UUID, vendorID uuid.UUID) (*database.Star, error) {
	return b.Database.Star(userID, vendorID)
}

func (b *Backend) CountVendorStars(vendorID uuid.UUID) (int, error) {
	return b.Database.CountVendorStars(vendorID)
}

func (b *Backend) StarDelete(userID uuid.UUID, vendorID uuid.UUID) error {
	return b.Database.StarDelete(userID, vendorID)
}

func (b *Backend) AreaCreate(userID uuid.UUID, area *database.Areas) error {
	vendor, err := b.Database.VendorByOwnerID(userID)
	if err != nil {
		return err
	}

	if vendor.ID != area.VendorID {
		return unauthorized
	}

	return b.Database.AreasCreate(area)
}

func (b *Backend) AreasByVendorID(vendorID uuid.UUID) ([]database.Areas, error) {
	return b.Database.AreasByVendorID(vendorID)
}

func (b *Backend) AreaDelete(userID uuid.UUID, id uuid.UUID) error {
	vendor, err := b.Database.VendorByOwnerID(userID)
	if err != nil {
		return err
	}

	area, err := b.Database.Area(id)
	if err != nil {
		return err
	}

	if vendor.ID != area.VendorID {
		return unauthorized
	}

	return b.Database.AreasDelete(id)
}

func (b *Backend) CuisineTypeCreate(userID uuid.UUID, cuisineType *database.CuisineTypes) error {
	vendor, err := b.Database.VendorByOwnerID(userID)
	if err != nil {
		return err
	}

	if vendor.ID != cuisineType.VendorID {
		return unauthorized
	}

	return b.Database.CuisineTypesCreate(cuisineType)
}

func (b *Backend) CuisineTypeByVendorID(vendorID uuid.UUID) ([]database.CuisineTypes, error) {
	return b.Database.CuisineTypeByVendorID(vendorID)
}

func (b *Backend) CuisineTypeDelete(userID uuid.UUID, id uuid.UUID) error {
	vendor, err := b.Database.VendorByOwnerID(userID)
	if err != nil {
		return err
	}

	cuisineType, err := b.Database.CuisineType(id)
	if err != nil {
		return err
	}

	if vendor.ID != cuisineType.VendorID {
		return unauthorized
	}

	return b.Database.CuisineTypesDelete(id)
}

func (b *Backend) QueryCreate(userID uuid.UUID, query *database.Query) error {
	if query.UserID != userID {
		return unauthorized
	}
	query.DateRequested = time.Now()
	return b.Database.QueryCreate(query)
}

func (b *Backend) QueryByUserID(userID uuid.UUID) ([]database.Query, error) {
	return b.Database.QueryByUserID(userID)
}

func (b *Backend) Query(id uuid.UUID) (*database.Query, error) {
	return b.Database.Query(id)
}

func (b *Backend) PastSearchCreate(userID uuid.UUID, pastSearch *database.PastSearch) error {
	if pastSearch.UserID != userID {
		return unauthorized
	}

	return b.Database.PastSearchCreate(pastSearch)
}

func (b *Backend) PastSearch(userID uuid.UUID, id uuid.UUID) (*database.PastSearch, error) {
	pastSearch, err := b.Database.PastSearch(id)
	if err != nil {
		return nil, err
	}

	if pastSearch.UserID != userID {
		return nil, unauthorized
	}

	return pastSearch, nil
}

func (b *Backend) PastSearchByUserID(userID uuid.UUID) ([]database.PastSearch, error) {
	return b.Database.PastSearchByUserID(userID)
}

func (b *Backend) Discount(userID uuid.UUID, id uuid.UUID) (*database.Discount, error) {
	discount, err := b.Database.Discount(id)
	if err != nil {
		return nil, err
	}

	// The discount secret is private
	if discount.UserID != userID {
		return nil, unauthorized
	}

	return discount, nil
}

func (b *Backend) DiscountsByUser(userID uuid.UUID) ([]database.Discount, error) {
	return b.Database.DiscountsByUser(userID)
}

func (b *Backend) DiscountsBySecret(secret uuid.UUID) (*database.Discount, error) {
	return b.Database.DiscountBySecret(secret)
}

func (b *Backend) DiscountDelete(userID uuid.UUID, id uuid.UUID) error {
	// Only the vendor owner can delete the discount
	discount, err := b.Database.Discount(id)
	if err != nil {
		return err
	}

	vendor, err := b.Database.Vendor(discount.VendorID)
	if err != nil {
		return err
	}

	if vendor.Owner != userID {
		return unauthorized
	}

	return b.Database.DiscountDelete(id)
}

func (b *Backend) NewChart() (database.StarRatingSum, error) {
	return b.Database.NewChart()
}
