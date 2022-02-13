package main

import (
	"github.com/bcfoodapp/streetfoodlove/uuid"
	"github.com/golang-jwt/jwt"
	"time"
)

// AccessTokenClaims is the access token payload.
type AccessTokenClaims struct {
	UserID uuid.UUID
	jwt.StandardClaims
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
