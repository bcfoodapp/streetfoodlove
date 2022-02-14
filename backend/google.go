package main

import (
	"encoding/json"
	"errors"
	"github.com/golang-jwt/jwt"
	"log"
	"net/http"
	"time"
)

var client = http.Client{
	Timeout: time.Second * 20,
}

func getGooglePublicKey(keyID string) (string, error) {
	resp, err := client.Get("https://www.googleapis.com/oauth2/v1/certs")
	if err != nil {
		return "", err
	}
	defer func() {
		if err := resp.Body.Close(); err != nil {
			log.Println(err)
		}
	}()

	response := map[string]string{}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return "", err
	}
	key, ok := response[keyID]
	if !ok {
		return "", errors.New("key not found")
	}
	return key, nil
}

func validateGoogleToken(tokenString string) (*jwt.StandardClaims, error) {
	keyFunc := func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, errors.New("unexpected signing method")
		}

		pem, err := getGooglePublicKey(token.Header["kid"].(string))
		if err != nil {
			return nil, err
		}
		key, err := jwt.ParseRSAPublicKeyFromPEM([]byte(pem))
		if err != nil {
			return nil, err
		}
		return key, nil
	}

	claims := &jwt.StandardClaims{}

	if _, err := jwt.ParseWithClaims(tokenString, claims, keyFunc); err != nil {
		return nil, err
	}

	if claims.Valid() != nil {
		return nil, claims.Valid()
	}

	if claims.Issuer != "accounts.google.com" && claims.Issuer != "https://accounts.google.com" {
		return nil, errors.New("iss is invalid")
	}

	if claims.Audience != "194003030221-uf763jqlstob3kof9c8du4j869lcd4f4.apps.googleusercontent.com" {
		return nil, errors.New("aud is invalid")
	}

	return claims, nil
}
