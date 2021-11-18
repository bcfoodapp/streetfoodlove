package main

import (
	"github.com/bcfoodapp/streetfoodlove/uuid"
	"github.com/gin-gonic/gin"
	"net/http"
)

type API struct {
	*Backend
}

func (a *API) Close() error {
	return a.Backend.Close()
}

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
