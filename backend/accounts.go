package main

import (
	"net/http"
	//"github.com/bcfoodapp/streetfoodlove/uuid"
	"github.com/gin-gonic/gin"
)

type user struct {
	UserID string `json:"id"`
	Username string `json:"username"`
	UserEmail string `json:"useremail"`
	SignUpDate string `json: "signupdate"`
	LoginPassword string `json: "loginpassword"`
	UserType int `json: "usertype"`
	Photo string `json: "photo"`
	FirstName string `json: "firstname"`
	LastName string `json: "lastname"`
}

type photo struct {
	PhotoID string `json: "id"`
	DatePosted string `json: "dateposted"`
	Text string `json: "text"`
	LinkID string `json: "linkid"`
}

type vendor struct {
	VendorID string `json: "vendorid"`
	BusinessName string `json: "businessname"`
	VendorAddress string `json: "address"`
	Website string `json: "website"`
	BusinessHours string `json: "hours"`
	Phone string `json: "phone"`

	// not sure whether I should store BusinessLogo as photo type
	BusinessLogo string `json: "logo"`
	Latitude float64 `json: "latitude"`
	Longitude float64 `json: "Longitude"`
}

type review struct {
	ReviewID string `json: "id"`
	DatePosted string `json: "dateposted"`
	Text string `json: "text"`
	VendorVendorID string `json: "vendorid"`
	UserUserID string `json: "userid"`
}

type guide struct {
	GuideId string `json: "id"`
	Guide string `json: "guide"`
	DatePosted string `json: "date"`
	ArticleAuthor string `json: "author"`
}

type link struct {
	Link_ID string `json: "id"`
	Title string `json: "title"`
	url string `json: "url"`
}

//create arrayliststo record the user/vendor/review/photo/link/guide data
var users = []user {
	{UserID: "uuid.MustParse('02c353e2-e0f5-4730-89c7-b0a0610232e4')",
	Username: "Selina2516",
	UserEmail: "seventan2516@gmail.com",
	SignUpDate: "2021-11-23 11:45",
	LoginPassword: "JINSIWDW234",
	UserType: 1,
	Photo: "image-1url",
	FirstName: "Selina",
	LastName:  "Tan"}, 
	{
	UserID: "uuid.MustParse('c8936fa6-69b7-4bf8-a033-a1056c80682a)",
	Username: "Jonney2313",
	UserEmail: "jonney2313@hotmail.com",
	SignUpDate: "2021-11-25 16:25",	
	LoginPassword: "738djsuw*dwd",
	UserType: 1,
	Photo: "image-5url",
	FirstName: "Jonney",
	LastName:  "William"}}


var vendors = []vendor {
	{ 
	VendorID: "uuid.MustParse('e72ac985-3d7e-47eb-9f0c-f8e52621a708')",
	BusinessName: "vendor0",
	VendorAddress: "address0",
	Website: "www.vendor0.com",
	BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
	Phone:           "123-123-1234",
	BusinessLogo:    "image0_url",
	Latitude:        47.608013,
	Longitude:       -122.335161}, 
	{
	VendorID: "uuid.MustParse('b924349d-442f-4fff-984e-ab0ec36f4590')",
	BusinessName: "vendor1",
	VendorAddress: "address1",
	Website:         "www.vendor1.com",
	BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
	Phone:           "321-321-4321",
	BusinessLogo:    "Image1_url",
	Latitude:        47.982567,
	Longitude:       -122.193375}}

var reviews = []review {}

var photos = []photo {}

var guides = []guide {}

var links = []link {}

func getUsers(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, users)
}

func getVendors(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, vendors)
}

func getReviews(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, reviews)
}

func getPhotos(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, photos)
}

func getGuides(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, guides)
}

func getLinks(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, links)
}

func postUsers(c *gin.Context) {
	var newUser user
	if err := c.BindJSON(&newUser); err != nil {
		return
	}

	users = append(users, newUser)
	c.IndentedJSON(http.StatusCreated, newUser)
}

func postVendors(c *gin.Context) {
	var newVendor vendor
	if err := c.BindJSON(&newVendor); err != nil {
		return
	}

	vendors = append(vendors, newVendor)
	c.IndentedJSON(http.StatusCreated, newVendor)
}

func postReviews(c *gin.Context) {
	var newReview review
	if err := c.BindJSON(&newReview); err != nil {
		return
	}

	reviews = append(reviews, newReview)
	c.IndentedJSON(http.StatusCreated, newReview)
}

func postPhotos(c *gin.Context) {
	var newPhoto photo
	if err := c.BindJSON(&newPhoto); err != nil {
		return
	}

	photos = append(photos, newPhoto)
	c.IndentedJSON(http.StatusCreated, newPhoto)
}

func postGuides(c *gin.Context) {
	var newGuide guide
	if err := c.BindJSON(&newGuide); err != nil {
		return
	}

	guides = append(guides, newGuide)
	c.IndentedJSON(http.StatusCreated, newGuide)
}

func postLinks(c *gin.Context) {
	var newLink link
	if err := c.BindJSON(&newLink); err != nil {
		return
	}

	links = append(links, newLink)
	c.IndentedJSON(http.StatusCreated, newLink)
}

func getUserByID(c *gin.Context) {
	id := c.Param("id")

	for _, a := range users {
		if  a.UserID == id {
			c.IndentedJSON(http.StatusOK, a)
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "user not fount"})
}

func getVendorByID(c *gin.Context) {
	id := c.Param("vendorid")

	for _, a := range vendors {
		if  a.VendorID == id {
			c.IndentedJSON(http.StatusOK, a)
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Business Vendor not fount"})
}

func main() {
	router := gin.Default()
	router.GET("/users", getUsers)
    router.GET("/users/:id", getUserByID)
	router.POST("/users", postUsers)

	router.GET("/vendors", getVendors)
	router.GET("/vendors/:vendorid", getVendorByID)
	router.POST("/users", postVendors)

	router.GET("/reviews", getReviews)
	router.POST("/users", postReviews)

	router.GET("/photos", getPhotos)
	router.POST("/users", postPhotos)

	router.GET("/guides", getGuides)
	router.POST("/users", postGuides)

	router.GET("/links", getLinks)
	router.POST("/users", postLinks)

	router.Run("localhost: 8080")
}
