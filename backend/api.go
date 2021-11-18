package main

import (
	"github.com/bcfoodapp/streetfoodlove/uuid"
	"github.com/gin-gonic/gin"
	"net/http"
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
	router.GET("/vendors/:id", a.Vendor)
}

func (a *API) Vendor(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	vendor, err := a.Backend.Vendor(id)
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	c.JSON(http.StatusOK, vendor)
	return
}
