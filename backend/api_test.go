//nolint: bodyclose
package backend

import (
	"fmt"
	"github.com/bcfoodapp/streetfoodlove/uuid"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestAuth(t *testing.T) {
	router := gin.New()
	resultID := uuid.UUID{}
	router.GET("/", Auth, func(c *gin.Context) {
		resultID = c.MustGet(userIDKey).(uuid.UUID)
	})

	{
		// Empty header
		w := httptest.NewRecorder()
		r := httptest.NewRequest(http.MethodGet, "/", nil)
		router.ServeHTTP(w, r)
		assert.Equal(t, http.StatusBadRequest, w.Result().StatusCode)
	}
	{
		// Empty token
		w := httptest.NewRecorder()
		r := httptest.NewRequest(http.MethodGet, "/", nil)
		r.Header.Add("Authorization", "Bearer ")
		router.ServeHTTP(w, r)
		assert.Equal(t, http.StatusBadRequest, w.Result().StatusCode)
	}
	{
		// Expired token
		userID := uuid.MustParse("18a0f9ad-acbb-48a2-9f90-45cbcb156c5a")
		claims := TokenClaims{
			UserID: userID,
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: 1,
			},
		}
		s, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(tokenSecret)
		require.NoError(t, err)

		w := httptest.NewRecorder()
		r := httptest.NewRequest(http.MethodGet, "/", nil)
		r.Header.Add("Authorization", fmt.Sprintf("Bearer %s", s))
		router.ServeHTTP(w, r)
		assert.Equal(t, http.StatusBadRequest, w.Result().StatusCode)
	}
	{
		// Success
		userID := uuid.MustParse("18a0f9ad-acbb-48a2-9f90-45cbcb156c5a")
		claims := TokenClaims{
			UserID: userID,
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: (time.Now().Add(time.Minute * 10)).Unix(),
			},
		}
		s, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(tokenSecret)
		require.NoError(t, err)

		w := httptest.NewRecorder()
		r := httptest.NewRequest(http.MethodGet, "/", nil)
		r.Header.Add("Authorization", fmt.Sprintf("Bearer %s", s))
		router.ServeHTTP(w, r)
		assert.Equal(t, http.StatusOK, w.Result().StatusCode)
		assert.Equal(t, userID, resultID)
	}
}
