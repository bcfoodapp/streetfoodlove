//nolint:errcheck
package main

import (
	"database/sql"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"

	"github.com/bcfoodapp/streetfoodlove/database"
	"github.com/bcfoodapp/streetfoodlove/uuid"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// API is the backend interface.
// API doc: https://app.swaggerhub.com/apis-docs/foodapp/FoodApp/0.0.1
type API struct {
	Backend *Backend
}

func (a *API) Close() error {
	return a.Backend.Close()
}

// AddRoutes adds all API routes.
func (a *API) AddRoutes(router *gin.Engine) {
	corsOptions := cors.DefaultConfig()
	corsOptions.AllowOrigins = []string{
		"http://localhost:3000",
		"https://bcfoodapp.github.io",
	}
	corsOptions.AddAllowHeaders("Authorization")
	router.Use(cors.New(corsOptions))
	router.Use(errorHandler)
	router.Use(gin.CustomRecovery(recovery))
	router.NoRoute(noRoute)

	router.GET("/", root)

	router.GET("/version", version)

	router.GET("/vendors", a.Vendors)
	router.GET("/vendors/:id", a.Vendor)
	router.PUT("/vendors/:id", GetToken, a.VendorPut)
	router.POST("/vendors/:id", GetToken, a.VendorPost)

	router.GET("/users/:id", a.User)
	router.GET("/users/:id/protected", GetToken, a.UserProtected)
	router.POST("/users/:id/protected", GetToken, a.UserProtectedPost)
	router.PUT("/users/:id/protected", a.UserProtectedPut)
	router.POST("/users/:id/s3-credentials", GetToken, a.UserS3CredentialsPost)

	router.GET("/reviews", a.Reviews)
	router.GET("/reviews/:id", a.Review)
	router.PUT("/reviews/:id", GetToken, a.ReviewPut)
	router.POST("/reviews/:id", GetToken, a.ReviewPost)

	router.POST("/token", a.TokenPost)
	router.PUT("/token/google/refresh", a.TokenGoogleRefreshPut)
	router.POST("/token/google", a.TokenGooglePost)

	router.GET("/map/view/:northWestLat/:northWestLng/:southEastLat/:southEastLng", a.MapView)

	router.PUT("/favorite/:id", a.FavoritePut)
	router.GET("/favorite/:id", a.Favorite)

	router.GET("/photos", a.Photos)
	router.GET("/photos/:id", a.Photo)
	router.PUT("/photos/:id", GetToken, a.PhotoPut)

	router.GET("/guides/:id", a.Guide)
	router.POST("/guides/:id", GetToken, a.GuidePost)

	router.GET("/links/:id", a.Link)
	router.POST("/links/:id", GetToken, a.LinkPost)

	router.GET("/stars/", a.Stars)
	router.GET("/stars/:id", a.Star)
	router.PUT("/stars/:id", GetToken, a.StarPut)
	router.GET("/stars/count-for-vendor/:vendorID", a.StarsCountForVendor)
	router.DELETE("/stars/:id", a.StarsDelete)
	router.GET("/areas/", a.Areas)
	router.PUT("/areas/:id", GetToken, a.AreaPut)
	router.GET("/cuisinetypes/", a.CuisineType)
	router.PUT("/cuisinetypes/:id", GetToken, a.CuisineTypePut)
}

// errorHandler writes any errors to response.
func errorHandler(c *gin.Context) {
	c.Next()
	for _, err := range c.Errors {
		c.JSON(http.StatusBadRequest, err.Error())
	}
}

// recovery is a gin.RecoveryFunc that writes errors to response.
func recovery(c *gin.Context, err interface{}) {
	if e, ok := err.(error); ok {
		c.AbortWithError(http.StatusInternalServerError, e)
	} else if s, ok := err.(string); ok {
		c.AbortWithStatusJSON(http.StatusInternalServerError, s)
	} else {
		c.AbortWithStatus(http.StatusInternalServerError)
	}
}

func noRoute(c *gin.Context) {
	c.JSON(http.StatusNotFound, "page not found")
}

var idsDoNotMatch = fmt.Errorf("ids do not match")

func root(c *gin.Context) {
	c.JSON(http.StatusOK, "StreetFoodLove API")
}

// version outputs the backend version.
func version(c *gin.Context) {
	file, err := os.Open("./version.json")
	if err != nil {
		c.Error(err)
		return
	}

	if _, err := io.Copy(c.Writer, file); err != nil {
		c.Error(err)
		return
	}
}

func (a *API) Vendor(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	vendor, err := a.Backend.Vendor(id)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, vendor)
}

func (a *API) VendorPut(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	vendor := &database.Vendor{}
	if err := c.ShouldBindJSON(vendor); err != nil {
		c.Error(err)
		return
	}

	if id != vendor.ID {
		c.Error(idsDoNotMatch)
		return
	}

	if err := a.Backend.VendorCreate(getTokenFromContext(c), vendor); err != nil {
		c.Error(err)
		return
	}
}

func (a *API) VendorPost(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	vendor := &database.Vendor{}
	if err := c.ShouldBindJSON(vendor); err != nil {
		c.Error(err)
		return
	}

	if id != vendor.ID {
		c.Error(idsDoNotMatch)
		return
	}

	if err := a.Backend.VendorUpdate(getTokenFromContext(c), vendor); err != nil {
		c.Error(err)
		return
	}
}

func (a *API) Vendors(c *gin.Context) {
	if c.Query("owner") != "" {
		ownerID, err := uuid.Parse(c.Query("owner"))
		if err != nil {
			c.Error(err)
			return
		}

		vendor, err := a.Backend.VendorByOwnerID(ownerID)
		if err != nil {
			c.Error(err)
			return
		}

		c.JSON(http.StatusOK, vendor)
		return
	}

	vendors, err := a.Backend.Vendors()
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, vendors)
}

func (a *API) User(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	user, err := a.Backend.User(id)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, user)
}

func (a *API) UserProtected(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	user, err := a.Backend.UserProtected(getTokenFromContext(c), id)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, user)
}

func (a *API) UserProtectedPost(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	user := &database.UserProtected{}
	if err := c.ShouldBindJSON(user); err != nil {
		c.Error(err)
		return
	}

	if id != user.ID {
		c.Error(idsDoNotMatch)
		return
	}

	if err := a.Backend.UserProtectedUpdate(getTokenFromContext(c), user); err != nil {
		c.Error(err)
		return
	}
}

func (a *API) UserProtectedPut(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	userWithPassword := &struct {
		*database.UserProtected
		Password string
	}{}
	if err := c.ShouldBindJSON(userWithPassword); err != nil {
		c.Error(err)
		return
	}

	if id != userWithPassword.ID {
		c.Error(idsDoNotMatch)
		return
	}

	if err := a.Backend.UserProtectedCreate(userWithPassword.UserProtected, userWithPassword.Password); err != nil {
		c.Error(err)
		return
	}
}

func (a *API) UserS3CredentialsPost(c *gin.Context) {
	credentials, err := a.Backend.UserS3Credentials(c, getTokenFromContext(c))
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, credentials)
}

func (a *API) Reviews(c *gin.Context) {
	vendorID, err := uuid.Parse(c.Query("vendorID"))
	if err != nil {
		c.Error(err)
		return
	}

	reviews, err := a.Backend.ReviewsByVendorID(vendorID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, reviews)
}

func (a *API) Review(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	review, err := a.Backend.Review(id)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, review)
}

func (a *API) ReviewPut(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	review := &database.Review{}
	if err := c.ShouldBindJSON(review); err != nil {
		c.Error(err)
		return
	}

	if id != review.ID {
		c.Error(idsDoNotMatch)
		return
	}

	if err := a.Backend.ReviewCreate(getTokenFromContext(c), review); err != nil {
		c.Error(err)
		return
	}
}

func (a *API) ReviewPost(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	review := &database.Review{}
	if err := c.ShouldBindJSON(review); err != nil {
		c.Error(err)
		return
	}

	if id != review.ID {
		c.Error(idsDoNotMatch)
		return
	}

	if err := a.Backend.ReviewUpdate(getTokenFromContext(c), review); err != nil {
		c.Error(err)
		return
	}
}

func (a *API) TokenPost(c *gin.Context) {
	credentials := &database.Credentials{}
	if err := c.ShouldBindJSON(credentials); err != nil {
		c.Error(err)
		return
	}

	userID, err := a.Backend.Database.UserIDByCredentials(credentials)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, generateAccessToken(userID))
}

func (a *API) TokenGoogleRefreshPut(c *gin.Context) {
	type TokenGoogleRefreshPutRequest struct {
		GoogleToken string
	}

	request := &TokenGoogleRefreshPutRequest{}
	if err := c.ShouldBindJSON(request); err != nil {
		c.Error(err)
		return
	}

	claims, err := validateGoogleToken(request.GoogleToken)
	if err != nil {
		c.Error(err)
		return
	}

	if _, err := a.Backend.Database.UserIDByGoogleID(claims.Subject); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.AbortWithStatusJSON(http.StatusNotFound, "user with Google ID does not exist")
		} else {
			c.Error(err)
		}
		return
	}

	c.JSON(http.StatusOK, generateRefreshToken(claims.Subject))
}

func (a *API) TokenGooglePost(c *gin.Context) {
	type TokenGooglePostRequest struct {
		RefreshToken string
	}

	request := &TokenGooglePostRequest{}
	if err := c.ShouldBindJSON(request); err != nil {
		c.Error(err)
		return
	}

	claims, err := validateRefreshToken(request.RefreshToken)
	if err != nil {
		c.Error(err)
		return
	}

	userID, err := a.Backend.Database.UserIDByGoogleID(claims.GoogleID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, generateAccessToken(userID))
}

func (a *API) MapView(c *gin.Context) {
	northWestLat, err := strconv.ParseFloat(c.Param("northWestLat"), 64)
	if err != nil {
		c.Error(err)
		return
	}

	northWestLng, err := strconv.ParseFloat(c.Param("northWestLng"), 64)
	if err != nil {
		c.Error(err)
		return
	}

	southEastLat, err := strconv.ParseFloat(c.Param("southEastLat"), 64)
	if err != nil {
		c.Error(err)
		return
	}

	southEastLng, err := strconv.ParseFloat(c.Param("southEastLng"), 64)
	if err != nil {
		c.Error(err)
		return
	}

	bounds := database.CoordinateBounds{
		NorthWestLat: northWestLat,
		NorthWestLng: northWestLng,
		SouthEastLat: southEastLat,
		SouthEastLng: southEastLng,
	}
	vendors, err := a.Backend.VendorsByCoordinateBounds(&bounds)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, vendors)
}

func (a *API) Photos(c *gin.Context) {
	linkID, err := uuid.Parse(c.Query("link-id"))
	if err != nil {
		c.Error(err)
		return
	}

	photos, err := a.Backend.PhotosByLinkID(linkID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, photos)
}

func (a *API) Photo(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	photo, err := a.Backend.Photo(id)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, photo)
}

func (a *API) PhotoPut(c *gin.Context) {
	photo := &database.Photo{}
	if err := c.ShouldBindJSON(photo); err != nil {
		c.Error(err)
		return
	}

	if c.Param("id") != photo.ID {
		c.Error(idsDoNotMatch)
		return
	}

	if err := a.Backend.PhotoCreate(getTokenFromContext(c), photo); err != nil {
		c.Error(err)
		return
	}
}

func (a *API) Guide(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	guide, err := a.Backend.Guide(id)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, guide)
}

func (a *API) GuidePost(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}
	_ = id
	// TODO
}

func (a *API) Link(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	link, err := a.Backend.Link(id)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, link)
}

func (a *API) LinkPost(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}
	_ = id
	// TODO
}

func (a *API) FavoritePut(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	favorite := &database.Favorite{}
	if err := c.ShouldBindJSON(favorite); err != nil {
		c.Error(err)
		return
	}

	if id != favorite.ID {
		c.Error(idsDoNotMatch)
		return
	}

	if err := a.Backend.FavoriteCreate(getTokenFromContext(c), favorite); err != nil {
		c.Error(err)
		return
	}
}
func (a *API) Favorite(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	favorite, err := a.Backend.Favorite(id)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, favorite)
}

// ParseStarKey splits key into userID and vendorID
func ParseStarKey(key string) (*database.Star, error) {
	const uuidLength = 36

	if len(key) != uuidLength*2 {
		return nil, fmt.Errorf("key must be length 72 but is of length %v", len(key))
	}

	userID, err := uuid.Parse(key[:uuidLength])
	if err != nil {
		return nil, err
	}

	vendorID, err := uuid.Parse(key[uuidLength : uuidLength*2])
	if err != nil {
		return nil, err
	}

	return &database.Star{
		UserID:   userID,
		VendorID: vendorID,
	}, nil
}

func (a *API) StarPut(c *gin.Context) {
	key, err := ParseStarKey(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	star := &database.Star{}
	if err := c.ShouldBindJSON(star); err != nil {
		c.Error(err)
		return
	}

	if *key != *star {
		c.Error(fmt.Errorf("ID in path does not match body ID"))
		return
	}

	if err := a.Backend.StarCreate(getTokenFromContext(c), star); err != nil {
		c.Error(err)
		return
	}
}

func (a *API) Stars(c *gin.Context) {
	userID, err := uuid.Parse(c.Query("userID"))
	if err != nil {
		c.Error(err)
		return
	}

	stars, err := a.Backend.StarsByUserID(userID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, stars)
}

func (a *API) Star(c *gin.Context) {
	key, err := ParseStarKey(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	star, err := a.Backend.Star(key.UserID, key.VendorID)
	if errors.Is(err, sql.ErrNoRows) {
		c.Status(http.StatusNotFound)
		return
	}

	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, star)
}

func (a *API) StarsCountForVendor(c *gin.Context) {
	vendorID, err := uuid.Parse(c.Param("vendorID"))
	if err != nil {
		c.Error(err)
		return
	}

	count, err := a.Backend.CountVendorStars(vendorID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, count)
}

func (a *API) StarsDelete(c *gin.Context) {
	star, err := ParseStarKey(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	if err := a.Backend.StarDelete(star.UserID, star.VendorID); err != nil {
		c.Error(err)
		return
	}
}

// ParseStarKey splits key into userID and vendorID
func ParseAreaKey(key string) (*database.Areas, error) {
	const uuidLength = 81

	if len(key) != uuidLength {
		return nil, fmt.Errorf("key must be length 36 but is of length %v", len(key))
	}

	vendorID, err := uuid.Parse(key[:uuidLength])
	if err != nil {
		return nil, err
	}

	AreaName := key[uuidLength:]

	return &database.Areas{
		VendorID: vendorID,
		AreaName: AreaName,
	}, nil
}

func (a *API) AreaPut(c *gin.Context) {
	key, err := ParseAreaKey(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	area := &database.Areas{}
	if err := c.ShouldBindJSON(area); err != nil {
		c.Error(err)
		return
	}

	if *key != *area {
		c.Error(fmt.Errorf("ID in path does not match body ID"))
		return
	}

	if err := a.Backend.Database.AreasCreate(area); err != nil {
		c.Error(err)
		return
	}
}

func (a *API) Areas(c *gin.Context) {
	vendorID, err := uuid.Parse(c.Query("vendorID"))
	if err != nil {
		c.Error(err)
		return
	}

	areas, err := a.Backend.AreasByVendorID(vendorID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, areas)
}

// ParseStarKey splits key into userID and vendorID
func ParseCuisineTypeKey(key string) (*database.CuisineTypes, error) {
	const uuidLength = 81

	if len(key) != uuidLength {
		return nil, fmt.Errorf("key must be length 36 but is of length %v", len(key))
	}

	vendorID, err := uuid.Parse(key[:uuidLength])
	if err != nil {
		return nil, err
	}

	CuisineType := key[uuidLength:]

	return &database.CuisineTypes{
		VendorID:    vendorID,
		CuisineType: CuisineType,
	}, nil
}

func (a *API) CuisineTypePut(c *gin.Context) {
	key, err := ParseCuisineTypeKey(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	cuisineType := &database.CuisineTypes{}
	if err := c.ShouldBindJSON(cuisineType); err != nil {
		c.Error(err)
		return
	}

	if err := a.Backend.Database.CuisineTypesCreate(key); err != nil {
		c.Error(err)
		return
	}
}

func (a *API) CuisineType(c *gin.Context) {
	vendorID, err := uuid.Parse(c.Query("vendorID"))
	if err != nil {
		c.Error(err)
		return
	}

	cuisineType, err := a.Backend.CuisineTypeByVendorID(vendorID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, cuisineType)
}
