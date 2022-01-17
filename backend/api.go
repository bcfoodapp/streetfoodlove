//nolint:errcheck
package backend

import (
	"fmt"
	"github.com/bcfoodapp/streetfoodlove/uuid"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"net/http"
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

	router.GET("/vendors/:id", a.Vendor)
	router.GET("/users/:id", a.User)
	router.GET("/users/:id/protected", a.UserProtected)
	router.POST("/users/:id/protected", a.UserProtectedPost)
	router.PUT("/users/:id/protected", a.UserProtectedPut)
	router.GET("/reviews", a.ReviewsByVendorID)
	router.PUT("/reviews/:id", Auth, a.ReviewPut)
	router.GET("/reviews/:id", a.Review)
	router.POST("/token", a.TokenPost)
}

// errorHandler writes any errors to response
func errorHandler(c *gin.Context) {
	c.Next()
	for _, err := range c.Errors {
		c.JSON(http.StatusBadRequest, err.Error())
	}
}

var tokenSecret = []byte("key")

var userIDKey = "userID"

// TokenClaims is the token payload.
type TokenClaims struct {
	UserID uuid.UUID
	jwt.StandardClaims
}

// Auth is a middleware to validate token and get user ID. The user ID is retrieved with
// c.MustGet(userIDKey).(uuid.UUID).
func Auth(c *gin.Context) {
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

	user := &UserProtected{}
	if err := c.ShouldBindJSON(user); err != nil {
		c.Error(err)
		return
	}

	if id != user.ID {
		c.Error(fmt.Errorf("ids do not match"))
		return
	}

	// TODO Implement backend
	/*
		if err := a.Backend.UserProtectedUpdate(getTokenFromContext(c), user); err != nil {
			c.Error(err)
			return
		}
	*/
}

func (a *API) UserProtectedPut(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(err)
		return
	}

	userWithPassword := &struct {
		*UserProtected
		Password string
	}{}
	if err := c.ShouldBindJSON(userWithPassword); err != nil {
		c.Error(err)
		return
	}

	if id != userWithPassword.ID {
		c.Error(fmt.Errorf("ids do not match"))
		return
	}

	/*
		if err := a.Backend.UserProtectedCreate(userWithPassword.UserProtected, userWithPassword.Password); err != nil {
			c.Error(err)
			return
		}
	*/
}

ffunc (a *API) ReviewsByVendorID(c *gin.Context) {
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

	review := &Review{}
	if err := c.ShouldBindJSON(review); err != nil {
		c.Error(err)
		return
	}

	if id != review.ID {
		c.Error(fmt.Errorf("ids do not match"))
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
	credentials := &Credentials{}
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