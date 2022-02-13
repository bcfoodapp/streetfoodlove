package main

import (
	"fmt"
	"github.com/bcfoodapp/streetfoodlove/uuid"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"net/http"
	"strings"
	"time"
)

// AccessTokenClaims is the access token payload.
type AccessTokenClaims struct {
	UserID uuid.UUID
	jwt.StandardClaims
}

var tokenSecret = []byte("key")

var userIDKey = "userID"

// GetToken is a middleware to validate token and get user ID. The user ID is retrieved with
// getTokenFromContext().
func GetToken(c *gin.Context) {
	headerValue := c.GetHeader("Authorization")
	const bearer = "Bearer "
	if !strings.HasPrefix(headerValue, bearer) {
		c.AbortWithError(http.StatusBadRequest, fmt.Errorf("token not in bearer field"))
		return
	}

	tokenStr := strings.TrimPrefix(headerValue, bearer)

	claims := &AccessTokenClaims{}
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

func generateAccessToken(userID uuid.UUID) string {
	claims := AccessTokenClaims{
		UserID: userID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: (time.Now().Add(time.Minute*10 + time.Second*5)).Unix(),
		},
	}

	tokenStr, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(tokenSecret)
	if err != nil {
		// SignedString() should not fail
		panic(err)
	}

	return tokenStr
}

type RefreshTokenClaims struct {
	GoogleID string
	jwt.StandardClaims
}

func validateRefreshToken(refreshToken string) (*RefreshTokenClaims, error) {
	claims := &RefreshTokenClaims{}
	_, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid signing method")
		}

		return tokenSecret, nil
	})

	if err != nil {
		return nil, err
	}

	return claims, claims.Valid()
}

func generateRefreshToken(googleID string) string {
	claims := RefreshTokenClaims{
		GoogleID: googleID,
	}

	tokenStr, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(tokenSecret)
	if err != nil {
		// SignedString() should not fail
		panic(err)
	}

	return tokenStr
}
