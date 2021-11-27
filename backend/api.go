package main

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
	*Backend
}

func (a *API) Close() error {
	return a.Backend.Close()
}

// AddRoutes adds all API routes.
func (a *API) AddRoutes(router *gin.Engine) {
	corsOptions := cors.DefaultConfig()
	corsOptions.AllowOrigins = []string{"http://localhost:3000"}
	router.Use(cors.New(corsOptions))
	router.Use(errorHandler)

	router.GET("/vendors/:id", a.Vendor)
	router.GET("/users/:id", a.User)
	router.PUT("/reviews/:id", a.ReviewPut)
	router.GET("/reviews/:id", a.Review)
	router.POST("/token", a.TokenPost)
}

// errorHandler writes any errors to response
func errorHandler(c *gin.Context) {
	c.Next()
	for _, err := range c.Errors {
		c.String(http.StatusBadRequest, err.Error())
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
		c.AbortWithError(http.StatusBadRequest, fmt.Errorf("bearer not found"))
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
	return
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
	return
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

	if err := a.Backend.ReviewCreate(review); err != nil {
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
	return
}

func (a *API) TokenPost(c *gin.Context) {
	// Match user password with given password
	id := uuid.MustParse("18a0f9ad-acbb-48a2-9f90-45cbcb156c5a")

	// If matched
	claims := TokenClaims{
		UserID: id,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: (time.Now().Add(time.Minute * 10)).Unix(),
		},
	}

	tokenStr, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(tokenSecret)
	if err != nil {
		panic(err)
	}
	c.JSON(http.StatusOK, tokenStr)
}
