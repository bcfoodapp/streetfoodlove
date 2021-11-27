package main

import (
	"fmt"
	"github.com/bcfoodapp/streetfoodlove/uuid"
	"github.com/gin-contrib/cors"
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
	corsOptions := cors.DefaultConfig()
	corsOptions.AllowOrigins = []string{"http://localhost:3000"}
	router.Use(cors.New(corsOptions))
	router.Use(errorHandler)

	router.GET("/vendors/:id", a.Vendor)
	router.GET("/users/:id", a.User)
	router.PUT("/reviews/:id", a.ReviewPut)
	router.GET("/reviews/:id", a.Review)
}

// errorHandler writes any errors to response
func errorHandler(c *gin.Context) {
	c.Next()
	for _, err := range c.Errors {
		c.String(http.StatusBadRequest, err.Error())
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
