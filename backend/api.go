//nolint:errcheck
package main

import (
	"fmt"
	"github.com/bcfoodapp/streetfoodlove/database"
	"github.com/bcfoodapp/streetfoodlove/uuid"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"net/http"
	"strconv"
	"strings"
	"time"
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
	corsOptions.AllowOrigins = []string{"http://localhost:3000"}
	corsOptions.AddAllowHeaders("Authorization")
	router.Use(cors.New(corsOptions))
	router.Use(errorHandler)
	router.Use(gin.CustomRecovery(recovery))

	router.GET("/vendors/:id", a.Vendor)
	router.GET("/users/:id", a.User)
	router.GET("/users/:id/protected", GetToken, a.UserProtected)
	router.POST("/users/:id/protected", GetToken, a.UserProtectedPost)
	router.PUT("/users/:id/protected", GetToken, a.UserProtectedPut)
	router.GET("/reviews", a.ReviewsByVendorID)
	router.PUT("/reviews/:id", GetToken, a.ReviewPut)
	router.GET("/reviews/:id", a.Review)
	router.POST("/token", a.TokenPost)
	router.GET("/map/view/:northWestLat/:northWestLng/:southEastLat/:southEastLng", a.MapView)

	router.GET("/photos/:id", a.Photo)
	router.POST("/photos/:id", GetToken, a.PhotoPost)

	router.GET("/guides/:id", a.Guide)
	router.POST("/guides/:id", GetToken, a.GuidePost)

	router.GET("/links/:id", a.Link)
	router.POST("/links/:id", GetToken, a.LinkPost)
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

var tokenSecret = []byte("key")

var userIDKey = "userID"

// TokenClaims is the token payload.
type TokenClaims struct {
	UserID uuid.UUID
	jwt.StandardClaims
}

// GetToken is a middleware to validate token and get user ID. The user ID is retrieved with
// c.MustGet(userIDKey).(uuid.UUID).
func GetToken(c *gin.Context) {
	headerValue := c.GetHeader("Authorization")
	const bearer = "Bearer "
	if !strings.HasPrefix(headerValue, bearer) {
		c.AbortWithError(http.StatusBadRequest, fmt.Errorf("token not in bearer field"))
		return
	}

	tokenStr := strings.TrimPrefix(headerValue, bearer)

	claims := &TokenClaims{}
	_, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid signing method")
		}

		return tokenSecret, nil
	})

	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	if claims.Valid() != nil {
		c.AbortWithError(http.StatusUnauthorized, claims.Valid())
		return
	}

	c.Set(userIDKey, claims.UserID)
}

func getTokenFromContext(c *gin.Context) uuid.UUID {
	return c.MustGet(userIDKey).(uuid.UUID)
}

var idsDoNotMatch = fmt.Errorf("ids do not match")

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

func (a *API) ReviewsByVendorID(c *gin.Context) {
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

	if err := a.Backend.ReviewPut(getTokenFromContext(c), review); err != nil {
		c.Error(err)
		return
	}
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

	claims := TokenClaims{
		UserID: userID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: (time.Now().Add(time.Minute*10 + time.Second*5)).Unix(),
		},
	}

	tokenStr, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(tokenSecret)
	if err != nil {
		panic(err)
	}
	c.JSON(http.StatusOK, tokenStr)
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

func (a *API) PhotoPost(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}
	_ = id
	// TODO
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
