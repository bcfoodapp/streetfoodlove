// Resets local database state.
package main

import (
	"os"
	"time"

	"github.com/bcfoodapp/streetfoodlove/database"
	"github.com/bcfoodapp/streetfoodlove/uuid"
	"github.com/jmoiron/sqlx"
)

func main() {
	var config *database.Configuration

	secretsFile, isProduction := os.LookupEnv("SECRETS_FILE")
	if isProduction {
		config = database.Production(secretsFile)
	} else {
		config = database.Development()
	}

	func() {
		mysqlConfig := config.MySQLConfig
		mysqlConfig.DBName = ""
		db, err := sqlx.Connect("mysql", mysqlConfig.FormatDSN())
		if err != nil {
			panic(err)
		}
		defer func() {
			if err := db.Close(); err != nil {
				panic(err)
			}
		}()

		if err := database.ResetDatabase(db); err != nil {
			return
		}
	}()

	db, err := sqlx.Connect("mysql", config.MySQLConfig.FormatDSN())
	if err != nil {
		panic(err)
	}

	if err := database.SetupTables(db); err != nil {
		panic(err)
	}

	if err := addTestData(database.NewDatabase(db)); err != nil {
		panic(err)
	}
}

func addTestData(db *database.Database) error {
	users := []database.UserProtected{
		{
			User: &database.User{
				ID:        uuid.MustParse("02c353e2-e0f5-4730-89c7-b0a0610232e4"),
				Username:  "test",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Selina",
				LastName:  "Tan",
			},
			Email:      "seventan2516@gmail.com",
			SignUpDate: time.Date(2021, 11, 23, 11, 45, 0, 0, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("c8936fa6-69b7-4bf8-a033-a1056c80682a"),
				Username:  "Jonney2313",
				UserType:  database.UserTypeVendor,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Jonney",
				LastName:  "William",
			},
			Email:      "jonney2313@hotmail.com",
			SignUpDate: time.Date(2021, 11, 23, 11, 45, 56, 35, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("c8b65370-fb11-4d9a-bc37-30fb6333338a"),
				Username:  "Ellen3512",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Ellen",
				LastName:  "Davis",
			},
			Email:      "jacques2014@yahoo.com",
			SignUpDate: time.Date(2021, 12, 13, 10, 25, 0, 0, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
				Username:  "Kathy925",
				UserType:  database.UserTypeVendor,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Kathy",
				LastName:  "Smith",
			},
			Email:      "ardith_howe@gmail.com",
			SignUpDate: time.Date(2021, 12, 13, 15, 25, 23, 12, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("2e753fff-7932-4d8e-bf85-808e61e76117"),
				Username:  "Julia2587",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Julia",
				LastName:  "Adkins",
			},
			Email:      "wyatt1971@gmail.com",
			SignUpDate: time.Date(2021, 11, 27, 7, 25, 26, 43, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("7d66f9ac-d4be-4599-acce-a86c0952ec44"),
				Username:  "Matthew239",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Matthew",
				LastName:  "Varga",
			},
			Email:      "lee1989@yahoo.com",
			SignUpDate: time.Date(2021, 11, 25, 8, 34, 26, 47, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("d6bb0f2a-14b9-409b-b7df-626870ab2598"),
				Username:  "Patrick3920",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Patrick",
				LastName:  "Bell",
			},
			Email:      "wilsom_grad9@gmail.com",
			SignUpDate: time.Date(2021, 12, 22, 5, 45, 16, 40, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("40813717-938e-4b2a-b199-1678f3847f91"),
				Username:  "Albert678",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Albert",
				LastName:  "Clark",
			},
			Email:      "sheliao@gmail.com",
			SignUpDate: time.Date(2021, 12, 24, 6, 7, 23, 45, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("40ebb807-6bc7-4969-8280-2d6768f2ec3b"),
				Username:  "Bennie34",
				UserType:  database.UserTypeVendor,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Bennie",
				LastName:  "Partridge",
			},
			Email:      "alexane393@hotmail.com",
			SignUpDate: time.Date(2021, 12, 25, 16, 25, 34, 53, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("450c4ac1-b6b5-402e-8a5b-4114a2aaf712"),
				Username:  "Karen474",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Karen",
				LastName:  "Vidaurri",
			},
			Email:      "theodogra_tbe@gmail.com",
			SignUpDate: time.Date(2021, 12, 20, 15, 21, 45, 19, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
				Username:  "Charlos4738",
				UserType:  database.UserTypeVendor,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Charkis",
				LastName:  "Naylor",
			},
			Email:      "theut893@gmail.com",
			SignUpDate: time.Date(2021, 12, 23, 17, 45, 45, 34, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("1d9ec368-960b-4831-935c-fc107a36f9e0"),
				Username:  "Valeria289",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Valeri",
				LastName:  "Gibsonn",
			},
			Email:      "kayee_eie34@hotmail.com",
			SignUpDate: time.Date(2021, 12, 26, 18, 45, 32, 34, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("991ff7c9-8856-43dc-bdc1-ae824dbc980c"),
				Username:  "David483",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "David",
				LastName:  "Waller",
			},
			Email:      "waller_david293@hotmail.com",
			SignUpDate: time.Date(2021, 12, 26, 18, 34, 31, 56, time.UTC),
		},

		{
			User: &database.User{
				ID:        uuid.MustParse("5f28ec16-b879-4e15-a742-52f17f82ec0f"),
				Username:  "Yolanda3682",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Yolanda",
				LastName:  "Acker",
			},
			Email:      "anabelle2930@gmail.com",
			SignUpDate: time.Date(2021, 12, 23, 15, 28, 15, 39, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("3f44d41f-9a8c-4035-baab-a1b00cbf2785"),
				Username:  "Samaths839",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Samaths",
				LastName:  "Rabinows",
			},
			Email:      "deja2839@gmail.com",
			SignUpDate: time.Date(2021, 12, 27, 12, 56, 45, 50, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
				Username:  "Harry3738",
				UserType:  database.UserTypeVendor,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Harry",
				LastName:  "Johnson",
			},
			Email:      "miseal2394@gmail.com",
			SignUpDate: time.Date(2021, 12, 20, 5, 11, 34, 45, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("4c504891-d656-4aa9-b7a0-f318a189e546"),
				Username:  "Berioa383",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Berioa",
				LastName:  "Green",
			},
			Email:      "jusleo2930@hotmail.com",
			SignUpDate: time.Date(2021, 12, 27, 18, 21, 35, 7, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("42b4a164-2cde-471a-8286-b9d1193148c1"),
				Username:  "Bean3839",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Bean",
				LastName:  "Lee",
			},
			Email:      "bean_lee290@gmail.com",
			SignUpDate: time.Date(2021, 12, 23, 23, 12, 45, 11, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
				Username:  "Charlotte2839",
				UserType:  database.UserTypeVendor,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Charlotte",
				LastName:  "Gray",
			},
			Email:      "charlotte3839@gmail.com",
			SignUpDate: time.Date(2021, 12, 25, 16, 23, 45, 18, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("cbb0808d-5f91-438a-a026-e78e3f76da30"),
				Username:  "Shane3839",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Shane",
				LastName:  "Harrie",
			},
			Email:      "seven39302@gmail.com",
			SignUpDate: time.Date(2021, 12, 29, 13, 22, 45, 9, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("7efeb148-7596-4f47-a9b4-cc1b5a39b6d4"),
				Username:  "Robert389",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Robert",
				LastName:  "Bergeron",
			},
			Email:      "maribel1978@gmail.com",
			SignUpDate: time.Date(2021, 12, 20, 19, 45, 23, 34, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("62783d71-b56c-4e60-afe0-9695eea14b9e"),
				Username:  "Rosalina2394",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Rosalina",
				LastName:  "Marlowe",
			},
			Email:      "rosalina389@hotmail.com",
			SignUpDate: time.Date(2021, 12, 23, 17, 19, 46, 45, time.UTC),
		},
		{
			User: &database.User{
				ID:        uuid.MustParse("24b91853-b527-4216-b66c-41a785a5b5d1"),
				Username:  "Theresa393",
				UserType:  database.UserTypeCustomer,
				Photo:     "b2fe4301-32d5-49a9-aeca-42337801d8d1.svg",
				FirstName: "Theresa",
				LastName:  "Walker",
			},
			Email:      "kallie2393@hotmail.com",
			SignUpDate: time.Date(2021, 12, 25, 16, 34, 45, 29, time.UTC),
		},
	}

	for _, user := range users {
		if err := db.UserCreate(&user, "password"); err != nil {
			return err
		}
	}

	vendors := []database.Vendor{
		{
			ID:              uuid.MustParse("e72ac985-3d7e-47eb-9f0c-f8e52621a708"),
			Name:            "Great Clips",
			BusinessAddress: "130 Boren Ave N, Seattle, WA 98109, USA",
			Website:         "www.vendor0.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "123-123-1234",
			Latitude:        47.619303,
			Longitude:       -122.33482,
			Owner:           uuid.MustParse("c8936fa6-69b7-4bf8-a033-a1056c80682a"),
		},
		{
			ID:              uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d22"),
			Name:            "Uncle Sam's Sandwitch",
			BusinessAddress: "40 Bellevue Way NE, Bellevue, WA 98004, USA",
			Website:         "www.vendor1.com",
			BusinessHours:   "Mon-Sun 11:00AM-8:00PM",
			Phone:           "559-743-3566",
			Latitude:        47.610378,
			Longitude:       -122.200676,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d23"),
			Name:            "Colin Zhou",
			BusinessAddress: "4730 Brooklyn Ave NE, Seattle, WA 98105, USA",
			Website:         "www.vendor101.com",
			BusinessHours:   "Mon-Sun 11:00AM-8:00PM",
			Phone:           "559-743-3566",
			Latitude:        47.663732,
			Longitude:       -122.313783,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d25"),
			Name:            "Cosun Zhou",
			BusinessAddress: "909 NE Boat St, Seattle, WA 98105, USA",
			Website:         "www.vendor102.com",
			BusinessHours:   "Mon-Sun 11:00AM-8:00PM",
			Phone:           "559-743-3566",
			Latitude:        47.653782,
			Longitude:       -122.319393,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d28"),
			Name:            "John Davis",
			BusinessAddress: "4119 Meridian Ave N, Seattle, WA 98103, USA",
			Website:         "www.vendor103.com",
			BusinessHours:   "Mon-Sun 11:00AM-8:00PM",
			Phone:           "559-743-3566",
			Latitude:        47.657383,
			Longitude:       -122.33383,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("f4d8a290-da16-4a83-a4b6-2db613887f23"),
			Name:            "Eura's Sushi",
			BusinessAddress: "Main St & 106th Ave SE, Bellevue, WA 98004, USA",
			Website:         "www.vendor2.com",
			BusinessHours:   "Mon-Sat 11:00AM-5:00PM",
			Phone:           "424-234-2393",
			Latitude:        47.610219,
			Longitude:       -122.200428,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("30f15697-8c12-41cf-83d9-a9ccfe07c43e"),
			Name:            "Mommy's Flavor",
			BusinessAddress: "10502 Main St, Bellevue, WA 98004, USA",
			Website:         "www.vendor3.com",
			BusinessHours:   "Mon-Sun 8:00AM-8:00PM",
			Phone:           "566-122-3452",
			Latitude:        47.610356,
			Longitude:       -122.200135,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("3531910e-e3e9-4b8b-9a31-d9a55448b956"),
			Name:            "Magical Pizza",
			BusinessAddress: "30 Bellevue Way NE, Bellevue, WA 98004, USA",
			Website:         "www.vendor4.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "342-229-1232",
			Latitude:        47.6108395,
			Longitude:       -122.201395,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("da1e30f8-f47f-4520-985c-f88d07690337"),
			Name:            "Kerala's Kitchen",
			BusinessAddress: "1-5 Bellevue Way SE, Bellevue, WA 98004, USA",
			Website:         "www.vendor5.com",
			BusinessHours:   "Mon-Sun 8:00AM-7:00PM",
			Phone:           "206-237-8912",
			Latitude:        47.6102495,
			Longitude:       -122.2014594,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("21e0878a-3378-449f-abce-82dbf1145ab6"),
			Name:            "Cafe Yum",
			BusinessAddress: "11 Bellevue Way NE, Bellevue, WA 98004, USA",
			Website:         "www.vendor6.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "425-123-3113",
			Latitude:        47.610594,
			Longitude:       -122.2015935,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("0cfa988f-eae6-4e28-a4ed-d6df56f23776"),
			Name:            "Lina's Ice Cream",
			BusinessAddress: "42 Bellevue Way NE, Bellevue, WA 98004, USA",
			Website:         "www.vendor7.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "373-237-1203",
			Latitude:        47.610495,
			Longitude:       -122.2009302,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("da700177-e738-4651-9889-3025bf634ee0"),
			Name:            "Yammy Dumplings",
			BusinessAddress: "1 Bellevue Way NE, Bellevue, WA 98004, USA",
			Website:         "www.vendor8.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "293-239-2013",
			Latitude:        47.6104856,
			Longitude:       -122.2018996,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("6fe864a4-3de8-4ca4-9f10-38bceb3a8d52"),
			Name:            "Tasty Chicken Wings",
			BusinessAddress: "136 105th Ave NE, Bellevue, WA 98004, USA",
			Website:         "www.vendor9.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "401-130-1930",
			Latitude:        47.6109099,
			Longitude:       -122.2001394,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("29b074e4-f335-4787-b798-dc832056e16f"),
			Name:            "Seven's Seafood",
			BusinessAddress: "11065 NE 6th St, Bellevue, WA 98004, USA",
			Website:         "www.vendor10.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "398-120-1390",
			Latitude:        47.6149967,
			Longitude:       -122.19305955,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("c28c2a93-36af-44dc-a90d-c01090a09836"),
			Name:            "Texas's flavor",
			BusinessAddress: "15600 NE 8th St, Bellevue, WA 98008, USA",
			Website:         "www.vendor11.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "839-393-1939",
			Latitude:        47.618713,
			Longitude:       -122.131431,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("3becace8-89f5-4bc6-9379-8f84e891cd1d"),
			Name:            "Yeh&Yeh",
			BusinessAddress: "1 NE 6th St, Bellevue, WA 98008, USA",
			Website:         "www.vendor12.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "393-330-2201",
			Latitude:        47.615173,
			Longitude:       -122.122602,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("ec54fe44-f045-4f89-bbb2-e65278032a78"),
			Name:            "Greek Dish",
			BusinessAddress: "12816 SE 38th St Unit K, Bellevue, WA 98006, USA",
			Website:         "www.vendor13.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "402-930-2931",
			Latitude:        47.576382,
			Longitude:       -122.168412,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("105fab9b-dc74-44b0-baea-c6cb2fdddd77"),
			Name:            "Bobby's Donut",
			BusinessAddress: "3700 132nd Ave SE, Bellevue, WA 98006, USA",
			Website:         "www.vendor14.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "890-229-1901",
			Latitude:        47.577986,
			Longitude:       -122.164002,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("eb52a586-9bf9-49b8-ab53-66b1622d4c16"),
			Name:            "Tacos world",
			BusinessAddress: "14615 NE 29th Pl, Bellevue, WA 98007, USA",
			Website:         "www.vendor15.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "930-291-9012",
			Latitude:        47.635297,
			Longitude:       -122.146545,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("8ee2c22e-6379-4954-b004-d747652ea755"),
			Name:            "Fish Yum",
			BusinessAddress: "15990 NE 85th St, Redmond, WA 98052, USA",
			Website:         "www.vendor16.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "490-293-1293",
			Latitude:        47.678909,
			Longitude:       -122.128078,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("17dbed88-4248-4453-a32b-e1a3a8361740"),
			Name:            "Nick's Cuisine",
			BusinessAddress: "164th Avenue Northeast, Redmond, WA 98052, USA",
			Website:         "www.vendor17.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "390-290-2001",
			Latitude:        47.678371,
			Longitude:       -122.123115,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("ae72ac38-df76-4f0b-a7b2-3942c24482aa"),
			Name:            "Micky's Magical Cake",
			BusinessAddress: "10910 231st Way NE, Redmond, WA 98053, USA",
			Website:         "www.vendor18.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "784-290-2291",
			Latitude:        47.695793,
			Longitude:       -122.032421,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("613bc5c5-a3b3-4db4-b1c1-fc7bd5ff119f"),
			Name:            "Sheroah's bobble tea",
			BusinessAddress: "19621 NE Redmond Rd, Redmond, WA 98053, USA",
			Website:         "www.vendor19.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "890-110-2291",
			Latitude:        47.694467,
			Longitude:       -122.076844,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("94ba0158-df11-4a8a-a3c7-60f7d022c2db"),
			Name:            "Piece of Cake",
			BusinessAddress: "22915 NE Alder Crest Dr, Redmond, WA 98053, USA",
			Website:         "www.vendor20.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "839-220-1101",
			Latitude:        47.691689,
			Longitude:       -122.03337,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("4b77070b-a507-4a63-90b1-115fa3f6d658"),
			Name:            "Pho Oah",
			BusinessAddress: "23605 NE 54th Pl, Redmond, WA 98053, USA",
			Website:         "www.vendor21.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "673-382-2999",
			Latitude:        47.655611,
			Longitude:       -122.024332,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("09d8b204-1b5c-4203-b174-d44eda838a0e"),
			Name:            "Grandma's pancake",
			BusinessAddress: "10909 156th Pl NE, Redmond, WA 98052, USA",
			Website:         "www.vendor22.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "492-293-2000",
			Latitude:        47.698145,
			Longitude:       -122.132172,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("46b9c2c3-ca38-4409-b292-2f84c44d6b07"),
			Name:            "Sunny's Fish Ball",
			BusinessAddress: "10754 155th Pl NE, Redmond, WA 98052, USA",
			Website:         "www.vendor23.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "893-221-3932",
			Latitude:        47.695789,
			Longitude:       -122.1324566,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("52fe8350-e7c7-48dc-b4ea-25e900a19161"),
			Name:            "Cherry's Sausage",
			BusinessAddress: "15454 NE 107th Way, Redmond, WA 98052, USA",
			Website:         "www.vendor24.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "428-392-1193",
			Latitude:        47.6967493,
			Longitude:       -122.1348294,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("d2f3bba7-7e1c-4125-a5d5-7c2677f9978b"),
			Name:            "Alpile Sandwitch",
			BusinessAddress: "10337 155th Ave NE, Redmond, WA 98052, USA",
			Website:         "www.vendor25.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "290-201-3021",
			Latitude:        47.6930485,
			Longitude:       -122.133035,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("ab291625-c232-4a7a-88c1-c6c260e25fbb"),
			Name:            "Papi's Waffle",
			BusinessAddress: "10655 Redmond - Woodinville Rd NE, Redmond, WA 98052, USA",
			Website:         "www.vendor26.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "319-201-2213",
			Latitude:        47.6953894,
			Longitude:       -122.1329485,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("e3b9f317-8f31-4439-a10e-fb104bf89d87"),
			Name:            "Flex Egg",
			BusinessAddress: "15217 NE 110th Pl, Redmond, WA 98052, USA",
			Website:         "www.vendor27.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "289-288-3987",
			Latitude:        47.6983958,
			Longitude:       -122.1349385,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("02a30d0f-f6e9-4564-b881-3a8dc6d9523e"),
			Name:            "Fish&Chips",
			BusinessAddress: "15209 NE 110th Pl, Redmond, WA 98052, USA",
			Website:         "www.vendor28.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "789-222-2012",
			Latitude:        47.6983954,
			Longitude:       -122.1359305,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("638c5fda-98c6-4af3-9034-32c122905d73"),
			Name:            "Taco Bell",
			BusinessAddress: "10737 154th Pl NE, Redmond, WA 98052, USA",
			Website:         "www.vendor29.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "206-788-1231",
			Latitude:        47.69594034,
			Longitude:       -122.1349945,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("b2ecce1d-7ad0-4613-ad2e-ced6e57347b5"),
			Name:            "Gigi's beef",
			BusinessAddress: "10611 Redmond Ridge Dr NE, Redmond, WA 98053, USA",
			Website:         "www.vendor30.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "445-230-1231",
			Latitude:        47.6929484,
			Longitude:       -122.035945,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("65282dca-80e6-4689-b1db-d6e7411399f8"),
			Name:            "Maxican's real dish",
			BusinessAddress: "12010 120th Pl NE, Kirkland, WA 98034, USA",
			Website:         "www.vendor31.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "450-231-2331",
			Latitude:        47.708037,
			Longitude:       -122.179536,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("883d983f-8d95-435c-8af2-f9f6222c6b46"),
			Name:            "Chinese Bistro",
			BusinessAddress: "12721 NE 116th St, Kirkland, WA 98034, USA",
			Website:         "www.vendor32.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "667-302-4451",
			Latitude:        47.703794,
			Longitude:       -122.16994,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("71801960-6ad6-4a98-8701-c4a233665e25"),
			Name:            "Ramen House",
			BusinessAddress: "NE 132nd St & 121st Ave NE, Kirkland, WA 98034, USA",
			Website:         "www.vendor33.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "450-231-2290",
			Latitude:        47.718395,
			Longitude:       -122.179304,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("ebb44ffb-10e3-49ad-b0c9-94db68ba0d1c"),
			Name:            "Nana's Ice Cream",
			BusinessAddress: "13115 121st Way NE, Kirkland, WA 98034, USA",
			Website:         "www.vendor34.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "679-229-9012",
			Latitude:        47.7177394,
			Longitude:       -122.1789305,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("44ebc1b8-bb85-4f42-872e-5321c36cc147"),
			Name:            "Bear Food Truck",
			BusinessAddress: "13030 121st Way NE, Kirkland, WA 98034, USA",
			Website:         "www.vendor35.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "780-234-1123",
			Latitude:        47.7178394,
			Longitude:       -122.1788774,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("a2cca59f-0c04-446e-8ab3-d39eeba2b255"),
			Name:            "Wendy's Chicken",
			BusinessAddress: "12600 120th Ave NE, Kirkland, WA 98034, USA",
			Website:         "www.vendor36.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "423-129-2201",
			Latitude:        47.713023,
			Longitude:       -122.179472,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("659dbe78-7523-4c12-8df6-7f9652fb6397"),
			Name:            "JP Tasty",
			BusinessAddress: "11750 NE 118th St, Kirkland, WA 98034, USA",
			Website:         "www.vendor37.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "783-223-1103",
			Latitude:        47.706481,
			Longitude:       -122.186044,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("0f50e68a-83ad-4765-978c-033cea348aad"),
			Name:            "Flavor You",
			BusinessAddress: "123 5th Ave, Kirkland, WA 98033, USA",
			Website:         "www.vendor38.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "390-239-1121",
			Latitude:        47.678455,
			Longitude:       -122.20717,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("cd68d890-876d-43e9-9bb1-fcf954bf0931"),
			Name:            "Hotdog Yam",
			BusinessAddress: "12015 115th Ave NE, Kirkland, WA 98034, USA",
			Website:         "www.vendor39.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "445-221-9023",
			Latitude:        47.7078394,
			Longitude:       -122.18799304,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("033d2218-28bd-4472-87e8-6598cd4af28f"),
			Name:            "Vicky's brunch",
			BusinessAddress: "11721 NE 117th Ct, Kirkland, WA 98034, USA",
			Website:         "www.vendor40.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "789-231-2212",
			Latitude:        47.70453789,
			Longitude:       -122.185789,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("8e2ba32b-a491-4a55-bd17-a6592980b0ad"),
			Name:            "Pizza Hub",
			BusinessAddress: "207 2nd Ave S, Kirkland, WA 98033, USA",
			Website:         "www.vendor41.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "349-330-2212",
			Latitude:        47.673940234,
			Longitude:       -122.2036845,
			Owner:           uuid.MustParse("baf75627-1fbe-45fe-a420-1e475ef6d24b"),
		},
		{
			ID:              uuid.MustParse("56a1122b-bf47-403a-ac4a-7268f8da4a38"),
			Name:            "Fashion Dim Sum",
			BusinessAddress: "65 Kirkland Ave, Kirkland, WA 98033, USA",
			Website:         "www.vendor42.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "890-223-2209",
			Latitude:        47.745332,
			Longitude:       -122.207799,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("0b2f894d-280d-47bb-870d-c92786b1b77e"),
			Name:            "T&T ramen",
			BusinessAddress: "403 18th Ave, Kirkland, WA 98033, USA",
			Website:         "www.vendor43.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "667-334-8902",
			Latitude:        47.689403,
			Longitude:       -122.20228493,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("d72b253e-4925-4735-ac08-74e34e1e8181"),
			Name:            "Yammy Sushi",
			BusinessAddress: "329 2nd Ave S, Kirkland, WA 98033, USA",
			Website:         "www.vendor44.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "789-223-1220",
			Latitude:        47.6738923,
			Longitude:       -122.20118394,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("ed3d88c2-e4bd-41de-babc-7e321af8405f"),
			Name:            "Cheese World",
			BusinessAddress: "308 Kirkland Ave, Kirkland, WA 98033, USA",
			Website:         "www.vendor45.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "449-234-2390",
			Latitude:        47.676018,
			Longitude:       -122.202929,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("138e277a-2ff7-490f-a206-38200fe5b841"),
			Name:            "Great Pancakes",
			BusinessAddress: "18516 101st Ave NE, Bothell, WA 98011, USA",
			Website:         "www.vendor46.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "678-2399-2044",
			Latitude:        47.7623204,
			Longitude:       -122.20540349999999,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("b185e9c0-3b94-4f22-9141-499863d00e08"),
			Name:            "Roasted Beef",
			BusinessAddress: "1729 208th St SE, Bothell, WA 98012, USA",
			Website:         "www.vendor47.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "459-332-1103",
			Latitude:        47.809785,
			Longitude:       -122.209475,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("4e0874f8-53df-4522-8dce-8b2d874aa879"),
			Name:            "Little Duck's BBQ",
			BusinessAddress: "17331 18th Ave SE, Bothell, WA 98012, USA",
			Website:         "www.vendor48.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "490-233-2901",
			Latitude:        47.839593,
			Longitude:       -122.207483,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("d1baa338-2aef-4524-ba34-d7e389149237"),
			Name:            "Feitoza's bread",
			BusinessAddress: "2316 169th Pl SE, Bothell, WA 98012, USA",
			Website:         "www.vendor49.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "442-009-4229",
			Latitude:        47.8439485,
			Longitude:       -122.2011935,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("22a8bb71-2a6d-4ba6-83ef-d00dee3743fa"),
			Name:            "Kiki Bakery",
			BusinessAddress: "2313 175th St SE, Bothell, WA 98012, USA",
			Website:         "www.vendor50.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "433-220-2947",
			Latitude:        47.839458,
			Longitude:       -122.2013394,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("9171e802-6d09-4519-92dd-3d7251caddba"),
			Name:            "Jummis Egg rolls",
			BusinessAddress: "2309 192nd St SE, Bothell, WA 98012, USA",
			Website:         "www.vendor51.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "883-229-2942",
			Latitude:        47.8249583,
			Longitude:       -122.2015893,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("45f29539-5b5a-4c7b-97b1-d923ba920533"),
			Name:            "Austin's Specal",
			BusinessAddress: "2314 186th Pl SE, Bothell, WA 98012, USA",
			Website:         "www.vendor52.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "775-339-2294",
			Latitude:        47.828492,
			Longitude:       -122.201249334,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("c838f3d5-438d-4a62-8b5e-d59d67b16656"),
			Name:            "Luna's Coffe house",
			BusinessAddress: "2317 164th Pl SE, Bothell, WA 98012, USA",
			Website:         "www.vendor53.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "893-229-4567",
			Latitude:        47.8492033,
			Longitude:       -122.201394045,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("a1fa8ee2-42f1-464d-9418-9d295aec544d"),
			Name:            "Kerela's chicken",
			BusinessAddress: "17009 23rd Ave SE, Bothell, WA 98012, USA",
			Website:         "www.vendor54.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "748-294-2129",
			Latitude:        47.8434293,
			Longitude:       -122.20159303,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("69359153-3078-4e48-ad6a-eb5db9c1c5ec"),
			Name:            "Panda express",
			BusinessAddress: "23rd Ave SE & 168th St SE, North Creek, WA 98012, USA",
			Website:         "www.vendor55.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "783-239-3392",
			Latitude:        47.8453923,
			Longitude:       -122.20179394,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("27b846d6-d49b-424f-a705-3d4dab18d3f2"),
			Name:            "Jasime's Express",
			BusinessAddress: "15220 21st Ct SE, Mill Creek, WA 98012, USA",
			Website:         "www.vendor56.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "338-473-2945",
			Latitude:        47.859304,
			Longitude:       -122.2015934,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("8adc7c79-3277-466a-a77f-34f81a2deab7"),
			Name:            "Nick's special ramen",
			BusinessAddress: "16903 23rd Ave SE, Bothell, WA 98012, USA",
			Website:         "www.vendor57.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "429-349-7003",
			Latitude:        47.8443839,
			Longitude:       -122.20163394,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("e4161fa3-b949-4a32-b3c2-21388bb29611"),
			Name:            "Seafood Yummy",
			BusinessAddress: "15606 22nd Ct SE, Mill Creek, WA 98012, USA",
			Website:         "www.vendor58.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "349-789-9990",
			Latitude:        47.858394,
			Longitude:       -122.20179395,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("c4bb2615-7e0c-43bb-afdc-4f43e58a76fc"),
			Name:            "Caveman's cuisine",
			BusinessAddress: "2312 172nd Pl SE, Bothell, WA 98012, USA",
			Website:         "www.vendor59.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "449-239-3393",
			Latitude:        47.8411834,
			Longitude:       -122.20159394,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("b15bcbe6-4fcb-4380-ad65-5b7a668af648"),
			Name:            "Korean House",
			BusinessAddress: "2307 164th Pl SE, Bothell, WA 98012, USA",
			Website:         "www.vendor60.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "447-339-7492",
			Latitude:        47.8493033,
			Longitude:       -122.20169304,
			Owner:           uuid.MustParse("74fc6a6e-5283-4ca9-9666-3a67b2e267d5"),
		},
		{
			ID:              uuid.MustParse("40366ab9-40b9-4d75-aa2b-cf34019f01b1"),
			Name:            "Tofu Dishes",
			BusinessAddress: "14730 24th Ave SE, Mill Creek, WA 98012, USA",
			Website:         "www.vendor61.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "783-339-7485",
			Latitude:        47.8638342,
			Longitude:       -122.20159394,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("0d263604-01e1-4d55-8366-e846d2bda496"),
			Name:            "Teriyaki house",
			BusinessAddress: "2315 165th Pl SE, Bothell, WA 98012, USA",
			Website:         "www.vendor62.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "454-559-3402",
			Latitude:        47.848394,
			Longitude:       -122.20129495,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("14059aaa-d6d0-4b00-806e-8f627254e3ea"),
			Name:            "Love Dim Sum",
			BusinessAddress: "15609 22nd Ct SE, Mill Creek, WA 98012, USA",
			Website:         "www.vendor63.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "890-339-3892",
			Latitude:        47.856384,
			Longitude:       -122.20111284,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("ede0b378-4940-4628-82b0-4ce74170f438"),
			Name:            "ShareTea",
			BusinessAddress: "15933 23rd Ln SE, Mill Creek, WA 98012, USA",
			Website:         "www.vendor64.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "573-339-9204",
			Latitude:        47.8523829,
			Longitude:       -122.2013821,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("c05d270d-d87a-468b-b49d-90fd45326e14"),
			Name:            "Bill's pazzeria",
			BusinessAddress: "14804 24th Ave SE, Mill Creek, WA 98012, USA",
			Website:         "www.vendor65.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "677-495-4902",
			Latitude:        47.86331211,
			Longitude:       -122.201638492,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("31683dca-c500-4d8f-9c62-46a9ba5bfabd"),
			Name:            "Shirley's specail corn",
			BusinessAddress: "14507 21st Dr SE, Mill Creek, WA 98012, USA",
			Website:         "www.vendor66.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "668-684-3894",
			Latitude:        47.866672,
			Longitude:       -122.20153839,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("28f6d56a-b04f-49fd-b072-7c88b2d9c251"),
			Name:            "Curry House",
			BusinessAddress: "2324 150th Ct SE, Mill Creek, WA 98012, USA",
			Website:         "www.vendor67.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "783-784-4554",
			Latitude:        47.8611282,
			Longitude:       -122.20178232,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("c20c73b9-d1e4-4edc-a688-c71df788501b"),
			Name:            "Little Waffle House",
			BusinessAddress: "2232 141st Pl SE, Mill Creek, WA 98012, USA",
			Website:         "www.vendor68.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "455-390-3950",
			Latitude:        47.8691123,
			Longitude:       -122.20153637,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("aa49328a-5bc0-4052-a5a6-8e69831c2f94"),
			Name:            "Colossus Pizza",
			BusinessAddress: "2302 140th Pl SE, Mill Creek, WA 98012, USA",
			Website:         "www.vendor69.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "849-305-3593",
			Latitude:        47.8701238,
			Longitude:       -122.20163122,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("81f48ea8-64e8-4e34-a02d-e7fe3fb8df4d"),
			Name:            "Fly Chicken Wings",
			BusinessAddress: "13806 23rd Ave SE, Mill Creek, WA 98012, USA",
			Website:         "www.vendor70.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "559-304-3390",
			Latitude:        47.8722821,
			Longitude:       -122.2018392,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("b78ad07b-f4bb-43f6-bbde-2c6dc1bb2ec3"),
			Name:            "AppleBee's Noodle house",
			BusinessAddress: "2233 141st Pl SE, Mill Creek, WA 98012, USA",
			Website:         "www.vendor71.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "893-493-0093",
			Latitude:        47.8693853,
			Longitude:       -122.201819304,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("7b9d9dd5-e443-40de-b257-33b7366cd27e"),
			Name:            "Mimi Chicken",
			BusinessAddress: "2226 137th Pl SE, Mill Creek, WA 98012, USA",
			Website:         "www.vendor72.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "449-783-3394",
			Latitude:        47.8729384,
			Longitude:       -122.2017393,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("0be4c03e-130a-40fc-9993-8aa2ba08dbfc"),
			Name:            "Beef Special",
			BusinessAddress: "2217 132nd St SE, Everett, WA 98208, USA",
			Website:         "www.vendor73.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "467-399-3902",
			Latitude:        47.9791223,
			Longitude:       -122.2018392,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("71d607f6-0e7b-41a6-8565-e4fc8817c448"),
			Name:            "Fish Steak House",
			BusinessAddress: "3704 202nd Pl S E, Bothell, WA 98012, USA",
			Website:         "www.vendor74.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "738-393-3390",
			Latitude:        47.813297,
			Longitude:       -122.18346,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},

		{
			ID:              uuid.MustParse("2d0714c0-8ec2-4bf0-8301-90e7b0b15305"),
			Name:            "Jeara chicken",
			BusinessAddress: "20000 68th Ave W, Lynnwood, WA 98036, USA",
			Website:         "www.vendor75.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "884-393-3294",
			Latitude:        47.816702,
			Longitude:       -122.3272,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("d87fe13b-f68a-4c5f-87c2-3e9575c4e24b"),
			Name:            "Forash's noodle house",
			BusinessAddress: "199 Sunset Ave N, Edmonds, WA 98020, USA",
			Website:         "www.vendor76.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "139-395-3944",
			Latitude:        47.812591,
			Longitude:       -122.383078,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("638ede6f-e585-419a-9141-1511597bce99"),
			Name:            "Mexico Chicken",
			BusinessAddress: "199 Sunset Ave S, Edmonds, WA 98020, USA",
			Website:         "www.vendor77.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "749-300-0039",
			Latitude:        47.813484,
			Longitude:       -122.384932,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("0d413a39-2ba6-43a6-a3fd-2caf01b64749"),
			Name:            "Bear Cake",
			BusinessAddress: "19301 86th Ave W, Edmonds, WA 98026, USA",
			Website:         "www.vendor78.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "456-393-30502",
			Latitude:        47.82394,
			Longitude:       -122.49302,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("9f46f02f-6179-4a5d-8dd8-55303168881e"),
			Name:            "Soho Lunch",
			BusinessAddress: "19324 Broadway Ave, Snohomish, WA 98296, USA",
			Website:         "www.vendor79.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "344-393-3305",
			Latitude:        47.821283,
			Longitude:       -122.11193,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("621fde6d-7ebe-461a-8073-c57d123fd52d"),
			Name:            "Nancy's Chicken",
			BusinessAddress: "19204 13th Dr SE, Bothell, WA 98012, USA",
			Website:         "www.vendor80.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "556-383-3933",
			Latitude:        47.82372,
			Longitude:       -122.213829,
			Owner:           uuid.MustParse("01a37f1b-10af-4c93-b86e-463776a7f465"),
		},
		{
			ID:              uuid.MustParse("e97fe54b-172c-41f6-9f96-b340f4f4ce7d"),
			Name:            "Modern Wings",
			BusinessAddress: "19114 3rd Dr SE, Bothell, WA 98012, USA",
			Website:         "www.vendor81.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "233-234-2930",
			Latitude:        47.82432883,
			Longitude:       -122.227383,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("a5cdc31d-f8fa-48a5-b4c7-a6c0170c0c73"),
			Name:            "Taco Love",
			BusinessAddress: "19000 44th Ave W, Lynnwood, WA 98036, USA",
			Website:         "www.vendor82.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "373-395-3302",
			Latitude:        47.8257383,
			Longitude:       -122.2930443,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("3b4e1399-59b3-4bdb-8369-9b92808eecaf"),
			Name:            "Fresh Hanburger",
			BusinessAddress: "3711 196th St SW, Lynnwood, WA 98036, USA",
			Website:         "www.vendor83.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "373-389-3004",
			Latitude:        47.821475,
			Longitude:       -122.283421,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},

		{
			ID:              uuid.MustParse("563b6c42-c6c4-4d5a-b7e8-223658e55d9f"),
			Name:            "Teriyaki Noodle",
			BusinessAddress: "18905 33rd Ave W #207, Lynnwood, WA 98036, USA",
			Website:         "www.vendor84.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "738-449-3994",
			Latitude:        47.827133,
			Longitude:       -122.277137,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("2018afd7-fbb2-4b1d-b9bc-379707fe0048"),
			Name:            "Sushi Bento",
			BusinessAddress: "19002 33rd Ave W, Lynnwood, WA 98036, USA",
			Website:         "www.vendor85.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "389-349-3304",
			Latitude:        47.826382,
			Longitude:       -122.278391,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("20a54a74-dc2d-4be9-bce4-d96525fd6551"),
			Name:            "Sala house",
			BusinessAddress: "449 Madison St, Seattle, WA 98164, USA",
			Website:         "www.vendor86.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "653-394-2293",
			Latitude:        47.6062095,
			Longitude:       -122.3320708,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},

		{
			ID:              uuid.MustParse("c6cbda03-ebdb-49f3-823b-e604e46122be"),
			Name:            "Korean Food Love",
			BusinessAddress: "Madison St & 2nd Ave, Seattle, WA 98104, USA",
			Website:         "www.vendor87.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "344-393-9903",
			Latitude:        47.605362,
			Longitude:       -122.334839,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("7733fbea-3c44-4560-a215-b98a34eb2a75"),
			Name:            "Sabor's Ice Cream Shop",
			BusinessAddress: "3151 Elliott Ave, Seattle, WA 98121, USA",
			Website:         "www.vendor88.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "344-394-2201",
			Latitude:        47.618393,
			Longitude:       -122.35839,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("c2fd10a2-4c55-4aa9-8e9b-198197b063b2"),
			Name:            "Central Yamm",
			BusinessAddress: "951 Federal Ave E, Seattle, WA 98102, USA",
			Website:         "www.vendor89.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "637-229-3392",
			Latitude:        47.62839,
			Longitude:       -122.3193023,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("52aa067a-a1e3-4fef-b99b-fe24763bb96e"),
			Name:            "Mexican's Favorite Dishes",
			BusinessAddress: "507 Harvard Ave E, Seattle, WA 98102, USA",
			Website:         "www.vendor90.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "329-229-4491",
			Latitude:        47.623283,
			Longitude:       -122.3222383,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("0cffdf9c-9020-48dd-97a7-d20d9ae0b1e6"),
			Name:            "Vivi's special chicken",
			BusinessAddress: "2156 Boyer Ave E, Seattle, WA 98112, USA",
			Website:         "www.vendor91.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "492-333-2203",
			Latitude:        47.6392,
			Longitude:       -122.309293,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("68dfb696-5a88-4cc7-970f-8d42a1d16ee7"),
			Name:            "Thai Dish",
			BusinessAddress: "428 McGilvra Blvd E, Seattle, WA 98112, USA",
			Website:         "www.vendor92.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "448-339-2291",
			Latitude:        47.6233413,
			Longitude:       -122.2839302,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("94549d2c-ee68-44bf-9ead-a89204f814de"),
			Name:            "Korean Cuisine Special",
			BusinessAddress: "1950 116th Ave NE, Bellevue, WA 98004, USA",
			Website:         "www.vendor93.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "673-233-3397",
			Latitude:        47.6283992,
			Longitude:       -122.18392,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("dd0ccbc4-4b21-49e6-8e0c-aafa386824de"),
			Name:            "Villa Pancake",
			BusinessAddress: "1220 169th Pl NE, Bellevue, WA 98008, USA",
			Website:         "www.vendor94.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "733-992-4923",
			Latitude:        47.620293,
			Longitude:       -122.113839,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("06a559b1-e6dd-484d-946c-57973f8c77c5"),
			Name:            "Windy's spring roll",
			BusinessAddress: "3320 177th Ave NE, Redmond, WA 98052, USA",
			Website:         "www.vendor95.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "647-390-2224",
			Latitude:        47.639493,
			Longitude:       -122.10384,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("7eab8d4e-b8d1-4650-9d77-0a0020a24dd8"),
			Name:            "Fish Taco Special",
			BusinessAddress: "16638 NE 43rd Ct, Redmond, WA 98052, USA",
			Website:         "www.vendor96.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "445-339-4452",
			Latitude:        47.648392,
			Longitude:       -122.119383,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("4f94602f-0229-49d8-bd73-db07eb793ace"),
			Name:            "Seafood Sandwitch",
			BusinessAddress: "4800 Sand Point Way NE, Seattle, WA 98105, USA",
			Website:         "www.vendor97.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "477-223-3453",
			Latitude:        47.662638,
			Longitude:       -122.283265,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("7429a93e-9239-40a7-8469-2af44e23feb8"),
			Name:            "Hotdog special",
			BusinessAddress: "4100 15th Ave NE, Seattle, WA 98105, USA",
			Website:         "www.vendor98.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "239-483-3395",
			Latitude:        47.656673,
			Longitude:       -122.311338,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("dd1f8167-c0d0-4306-bcf2-d4e3e8840add"),
			Name:            "Latino's food",
			BusinessAddress: "4915 25th Ave NE, Seattle, WA 98105, USA",
			Website:         "www.vendor99.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "205-359-8894",
			Latitude:        47.66511,
			Longitude:       -122.301522,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
		{
			ID:              uuid.MustParse("a22f5681-b5ec-4775-aa5e-b88703024f7c"),
			Name:            "True Asian Food",
			BusinessAddress: "4875 9th Ave NE, Seattle, WA 98105, USA",
			Website:         "www.vendor100.com",
			BusinessHours:   "Mon-Sun 8:00AM-5:00PM",
			Phone:           "485-359-3903",
			Latitude:        47.6648293,
			Longitude:       -122.318392,
			Owner:           uuid.MustParse("47cc01f8-23ec-47ec-b3f8-4ca615718782"),
		},
	}

	for _, vendor := range vendors {
		if err := db.VendorCreate(&vendor); err != nil {
			return err
		}
	}

	cuisineTypes := []database.CuisineTypes{
		{
			ID:          uuid.MustParse("7d169364-a1cd-4b59-a006-7728e7ba5827"),
			VendorID:    uuid.MustParse("e72ac985-3d7e-47eb-9f0c-f8e52621a708"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("64e159a3-be8b-48e2-84ab-7f1071332628"),
			VendorID:    uuid.MustParse("e72ac985-3d7e-47eb-9f0c-f8e52621a708"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("7356a44b-f493-411d-aca0-6487fd4a3a28"),
			VendorID:    uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d22"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("4c742cdd-ae01-41ee-962c-080cda38b0ea"),
			VendorID:    uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d22"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("e8f18508-3c09-4cbb-bc80-a2a98d62efe1"),
			VendorID:    uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d23"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("90c01b52-9c64-44eb-93b4-0d6bd9e5f714"),
			VendorID:    uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d23"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("17645220-0e34-4ee0-b4cc-e3cc44431fb2"),
			VendorID:    uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d25"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("4324e172-323b-40fd-afeb-666783599002"),
			VendorID:    uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d25"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("8f0ecd03-b5d5-4fc5-a881-1e5a879c018d"),
			VendorID:    uuid.MustParse("f4d8a290-da16-4a83-a4b6-2db613887f23"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("54b7d9a8-296f-4b15-b092-12ed4444e5b3"),
			VendorID:    uuid.MustParse("f4d8a290-da16-4a83-a4b6-2db613887f23"),
			CuisineType: "Japanese",
		},
		{
			ID:          uuid.MustParse("84249f43-60f3-4491-9b05-bb38f37fc75f"),
			VendorID:    uuid.MustParse("30f15697-8c12-41cf-83d9-a9ccfe07c43e"),
			CuisineType: "Italian",
		},
		{
			ID:          uuid.MustParse("e5b6e74d-3524-4180-8e76-8901f8ea1fb0"),
			VendorID:    uuid.MustParse("3531910e-e3e9-4b8b-9a31-d9a55448b956"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("27dc87f9-cec2-463f-98a1-52d60af00140"),
			VendorID:    uuid.MustParse("3531910e-e3e9-4b8b-9a31-d9a55448b956"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("4feeee9f-b7f7-4244-9e7b-a884e46f48b6"),
			VendorID:    uuid.MustParse("da1e30f8-f47f-4520-985c-f88d07690337"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("ee573cd2-5f1d-4c05-b34d-9a62bd8df598"),
			VendorID:    uuid.MustParse("da1e30f8-f47f-4520-985c-f88d07690337"),
			CuisineType: "Japanese",
		},
		{
			ID:          uuid.MustParse("ff3aff23-cc2c-415c-a883-17d349599972"),
			VendorID:    uuid.MustParse("21e0878a-3378-449f-abce-82dbf1145ab6"),
			CuisineType: "French",
		},
		{
			ID:          uuid.MustParse("b3198748-7cad-4140-a076-d0996f6a7432"),
			VendorID:    uuid.MustParse("21e0878a-3378-449f-abce-82dbf1145ab6"),
			CuisineType: "Italian",
		},
		{
			ID:          uuid.MustParse("6d850f1b-7fd7-4ade-a6d8-aab93b7ad695"),
			VendorID:    uuid.MustParse("0cfa988f-eae6-4e28-a4ed-d6df56f23776"),
			CuisineType: "Thai",
		},
		{
			ID:          uuid.MustParse("7cd4a21a-4c86-45d4-ab5c-09a247876e4a"),
			VendorID:    uuid.MustParse("da700177-e738-4651-9889-3025bf634ee0"),
			CuisineType: "Japanese",
		},
		{
			ID:          uuid.MustParse("ea0b4389-0914-4545-adfc-925424b1741f"),
			VendorID:    uuid.MustParse("6fe864a4-3de8-4ca4-9f10-38bceb3a8d52"),
			CuisineType: "Mexican",
		},
		{
			ID:          uuid.MustParse("e8f967b7-da7b-4bec-8a9f-a3dc9c187c33"),
			VendorID:    uuid.MustParse("29b074e4-f335-4787-b798-dc832056e16f"),
			CuisineType: "German",
		},
		{
			ID:          uuid.MustParse("77a167ba-72e8-45af-b796-e757fda13502"),
			VendorID:    uuid.MustParse("c28c2a93-36af-44dc-a90d-c01090a09836"),
			CuisineType: "Russian",
		},
		{
			ID:          uuid.MustParse("26a147c9-4d37-443d-ab03-3d3104eada00"),
			VendorID:    uuid.MustParse("3becace8-89f5-4bc6-9379-8f84e891cd1d"),
			CuisineType: "Creek",
		},
		{
			ID:          uuid.MustParse("567b2b6d-5999-499b-a4d0-f137b85d16cb"),
			VendorID:    uuid.MustParse("ec54fe44-f045-4f89-bbb2-e65278032a78"),
			CuisineType: "Greek",
		},
		{
			ID:          uuid.MustParse("ffb6c1a4-1160-4649-bf58-b6682dd762f2"),
			VendorID:    uuid.MustParse("105fab9b-dc74-44b0-baea-c6cb2fdddd77"),
			CuisineType: "French",
		},
		{
			ID:          uuid.MustParse("7700b6be-8166-48ad-b687-25acbe840ce6"),
			VendorID:    uuid.MustParse("eb52a586-9bf9-49b8-ab53-66b1622d4c16"),
			CuisineType: "French",
		},
		{
			ID:          uuid.MustParse("ad7a6072-cc53-4a7a-bf76-471955f1774f"),
			VendorID:    uuid.MustParse("8ee2c22e-6379-4954-b004-d747652ea755"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("d1855ba0-5c06-4e88-8eaf-20149a7f22e2"),
			VendorID:    uuid.MustParse("8ee2c22e-6379-4954-b004-d747652ea755"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("96da58c0-3381-4fe7-b10b-43c9aee805c0"),
			VendorID:    uuid.MustParse("17dbed88-4248-4453-a32b-e1a3a8361740"),
			CuisineType: "Russian",
		},
		{
			ID:          uuid.MustParse("ead90fa6-7e8d-448f-84bb-f68b5c82532c"),
			VendorID:    uuid.MustParse("ae72ac38-df76-4f0b-a7b2-3942c24482aa"),
			CuisineType: "German",
		},
		{
			ID:          uuid.MustParse("c5fa3603-49b2-491b-8f22-d804990ebd00"),
			VendorID:    uuid.MustParse("613bc5c5-a3b3-4db4-b1c1-fc7bd5ff119f"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("560721a4-af0a-4038-8eb9-455ed7dc9f16"),
			VendorID:    uuid.MustParse("613bc5c5-a3b3-4db4-b1c1-fc7bd5ff119f"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("bf00b9c0-144a-43c3-9e42-c5a441e3ca09"),
			VendorID:    uuid.MustParse("94ba0158-df11-4a8a-a3c7-60f7d022c2db"),
			CuisineType: "German",
		},
		{
			ID:          uuid.MustParse("a13e855b-93a8-43e8-b51e-caca13d1554b"),
			VendorID:    uuid.MustParse("4b77070b-a507-4a63-90b1-115fa3f6d658"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("2f63bb77-926b-4480-a91d-c91e6944c72c"),
			VendorID:    uuid.MustParse("4b77070b-a507-4a63-90b1-115fa3f6d658"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("0bff6e60-8446-47a4-87fc-7c9298f819b4"),
			VendorID:    uuid.MustParse("09d8b204-1b5c-4203-b174-d44eda838a0e"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("a568338d-ebe0-49a9-93e6-d50bf8d13dbf"),
			VendorID:    uuid.MustParse("09d8b204-1b5c-4203-b174-d44eda838a0e"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("065015a3-26d9-4b1b-8285-43a9e17555ac"),
			VendorID:    uuid.MustParse("46b9c2c3-ca38-4409-b292-2f84c44d6b07"),
			CuisineType: "Mediterranean",
		},
		{
			ID:          uuid.MustParse("8aad7edb-8d9e-4437-95de-487ef753c864"),
			VendorID:    uuid.MustParse("52fe8350-e7c7-48dc-b4ea-25e900a19161"),
			CuisineType: "French",
		},
		{
			ID:          uuid.MustParse("1ecf843c-280d-4138-943b-e2bd0098c05a"),
			VendorID:    uuid.MustParse("d2f3bba7-7e1c-4125-a5d5-7c2677f9978b"),
			CuisineType: "Mexican",
		},
		{
			ID:          uuid.MustParse("3f5d5163-a985-4112-aae9-d3547128c254"),
			VendorID:    uuid.MustParse("ab291625-c232-4a7a-88c1-c6c260e25fbb"),
			CuisineType: "Mediterranean",
		},
		{
			ID:          uuid.MustParse("c2697f49-34ae-40a2-bceb-3fb2ecce20fc"),
			VendorID:    uuid.MustParse("e3b9f317-8f31-4439-a10e-fb104bf89d87"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("ad288da3-c225-4927-9632-060cca612480"),
			VendorID:    uuid.MustParse("02a30d0f-f6e9-4564-b881-3a8dc6d9523e"),
			CuisineType: "Mexican",
		},
		{
			ID:          uuid.MustParse("aa3dac6a-afdc-4d29-99ed-f9478c33f991"),
			VendorID:    uuid.MustParse("638c5fda-98c6-4af3-9034-32c122905d73"),
			CuisineType: "German",
		},
		{
			ID:          uuid.MustParse("a6b87c7e-7cc5-4036-b08a-9822f6ea3185"),
			VendorID:    uuid.MustParse("b2ecce1d-7ad0-4613-ad2e-ced6e57347b5"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("0a42a103-6141-49e5-8966-6bb14312350f"),
			VendorID:    uuid.MustParse("b2ecce1d-7ad0-4613-ad2e-ced6e57347b5"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("b0f3f7b1-b4ab-4523-ad11-d901d6e23816"),
			VendorID:    uuid.MustParse("65282dca-80e6-4689-b1db-d6e7411399f8"),
			CuisineType: "French",
		},
		{
			ID:          uuid.MustParse("e8354db8-e7a6-4351-ac96-09c1be785e6e"),
			VendorID:    uuid.MustParse("883d983f-8d95-435c-8af2-f9f6222c6b46"),
			CuisineType: "German",
		},
		{
			ID:          uuid.MustParse("4f60b818-787b-46f9-a5b7-12563d783d6a"),
			VendorID:    uuid.MustParse("71801960-6ad6-4a98-8701-c4a233665e25"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("9b08002c-7af6-411d-9a21-aec9a2b5d41a"),
			VendorID:    uuid.MustParse("ebb44ffb-10e3-49ad-b0c9-94db68ba0d1c"),
			CuisineType: "Mexican",
		},
		{
			ID:          uuid.MustParse("10e8fe13-bec0-45e0-8f8a-d5ade63fc33b"),
			VendorID:    uuid.MustParse("44ebc1b8-bb85-4f42-872e-5321c36cc147"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("564face9-dbab-4361-ad61-593475685e65"),
			VendorID:    uuid.MustParse("a2cca59f-0c04-446e-8ab3-d39eeba2b255"),
			CuisineType: "Japanese",
		},
		{
			ID:          uuid.MustParse("400b5d83-aba8-4575-b253-6efbc37f0d7c"),
			VendorID:    uuid.MustParse("a2cca59f-0c04-446e-8ab3-d39eeba2b255"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("1d41b52c-9931-4b69-afb0-b4193aff29e0"),
			VendorID:    uuid.MustParse("659dbe78-7523-4c12-8df6-7f9652fb6397"),
			CuisineType: "Spanish",
		},
		{
			ID:          uuid.MustParse("3dbe69fe-68c9-4279-9380-daade4294595"),
			VendorID:    uuid.MustParse("0f50e68a-83ad-4765-978c-033cea348aad"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("880e395f-b94a-4f8f-bdcd-6b1dfb8e6bf7"),
			VendorID:    uuid.MustParse("0f50e68a-83ad-4765-978c-033cea348aad"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("48d4c523-c4ed-4c96-9436-cecd1dc5da74"),
			VendorID:    uuid.MustParse("cd68d890-876d-43e9-9bb1-fcf954bf0931"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("1d785525-bc5d-405e-9670-837d2548f447"),
			VendorID:    uuid.MustParse("cd68d890-876d-43e9-9bb1-fcf954bf0931"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("491d4b1c-f465-401e-98c5-c2ca9ecb01d2"),
			VendorID:    uuid.MustParse("033d2218-28bd-4472-87e8-6598cd4af28f"),
			CuisineType: "Spanish",
		},
		{
			ID:          uuid.MustParse("bca439be-1f3c-4c1f-86db-d7abde7e576a"),
			VendorID:    uuid.MustParse("8e2ba32b-a491-4a55-bd17-a6592980b0ad"),
			CuisineType: "Thai",
		},
		{
			ID:          uuid.MustParse("6242db93-4a72-4667-b78f-133fc3f2571b"),
			VendorID:    uuid.MustParse("8e2ba32b-a491-4a55-bd17-a6592980b0ad"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("68f1809e-0290-486e-aa19-8d684535fae7"),
			VendorID:    uuid.MustParse("56a1122b-bf47-403a-ac4a-7268f8da4a38"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("6a032dfa-bc23-4809-a51b-68eb82e19192"),
			VendorID:    uuid.MustParse("0b2f894d-280d-47bb-870d-c92786b1b77e"),
			CuisineType: "Spanish",
		},
		{
			ID:          uuid.MustParse("f6ec5593-301a-4cb3-b889-6f94cad3864b"),
			VendorID:    uuid.MustParse("d72b253e-4925-4735-ac08-74e34e1e8181"),
			CuisineType: "Thai",
		},
		{
			ID:          uuid.MustParse("205a955b-12e9-4ee0-a8a3-a0f2d795cff8"),
			VendorID:    uuid.MustParse("ed3d88c2-e4bd-41de-babc-7e321af8405f"),
			CuisineType: "Spanish",
		},
		{
			ID:          uuid.MustParse("d45f432e-76ad-4740-a9f0-6a3546bf3f9a"),
			VendorID:    uuid.MustParse("138e277a-2ff7-490f-a206-38200fe5b841"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("ebe81287-9259-48f6-846c-6e20abf810f3"),
			VendorID:    uuid.MustParse("138e277a-2ff7-490f-a206-38200fe5b841"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("cacda29d-e25e-41f1-bc2d-ea51f59057be"),
			VendorID:    uuid.MustParse("b185e9c0-3b94-4f22-9141-499863d00e08"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("321e0717-9fe8-489c-9d44-077c6e71cd85"),
			VendorID:    uuid.MustParse("b185e9c0-3b94-4f22-9141-499863d00e08"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("0efceccd-381d-4c7b-a597-4a1f192d8c3e"),
			VendorID:    uuid.MustParse("4e0874f8-53df-4522-8dce-8b2d874aa879"),
			CuisineType: "Spanish",
		},
		{
			ID:          uuid.MustParse("5b2edfe3-0d6a-43a2-960a-995ce46d1473"),
			VendorID:    uuid.MustParse("d1baa338-2aef-4524-ba34-d7e389149237"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("c2e5e41a-2587-4648-a29e-454d7a37cacf"),
			VendorID:    uuid.MustParse("d1baa338-2aef-4524-ba34-d7e389149237"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("e9645bf9-c21c-4e78-ae8c-db88ebeea92b"),
			VendorID:    uuid.MustParse("22a8bb71-2a6d-4ba6-83ef-d00dee3743fa"),
			CuisineType: "Spanish",
		},
		{
			ID:          uuid.MustParse("2a2a9999-b07c-4d79-ba34-f64a260f329c"),
			VendorID:    uuid.MustParse("9171e802-6d09-4519-92dd-3d7251caddba"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("1c3240d5-e8b6-47cb-ba47-2423251aa40f"),
			VendorID:    uuid.MustParse("45f29539-5b5a-4c7b-97b1-d923ba920533"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("ec393321-3c4d-4609-8a8a-26fc82f59a72"),
			VendorID:    uuid.MustParse("c838f3d5-438d-4a62-8b5e-d59d67b16656"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("dd9a0b91-7d2e-4368-a7bd-dedf6a47e742"),
			VendorID:    uuid.MustParse("a1fa8ee2-42f1-464d-9418-9d295aec544d"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("13dcb7e1-7912-4ed0-a043-6d54e6ce58b7"),
			VendorID:    uuid.MustParse("69359153-3078-4e48-ad6a-eb5db9c1c5ec"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("0c11ffa0-1ce5-438f-82f8-2323af7b2773"),
			VendorID:    uuid.MustParse("27b846d6-d49b-424f-a705-3d4dab18d3f2"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("b3b13f0c-fe75-401e-b852-f8327a8d1143"),
			VendorID:    uuid.MustParse("27b846d6-d49b-424f-a705-3d4dab18d3f2"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("41d7a430-0b6f-43a0-bec0-d45748f61ee0"),
			VendorID:    uuid.MustParse("8adc7c79-3277-466a-a77f-34f81a2deab7"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("018fca54-b70a-4683-ae9b-9e45a2f57505"),
			VendorID:    uuid.MustParse("e4161fa3-b949-4a32-b3c2-21388bb29611"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("d093043d-9ba4-4038-a6f3-ead21c3d9a9b"),
			VendorID:    uuid.MustParse("c4bb2615-7e0c-43bb-afdc-4f43e58a76fc"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("18d20cfd-5e21-4f63-a8d7-8ccaadb2c672"),
			VendorID:    uuid.MustParse("c4bb2615-7e0c-43bb-afdc-4f43e58a76fc"),
			CuisineType: "Japanese",
		},
		{
			ID:          uuid.MustParse("340ee20f-c937-434b-896f-31326c25b25a"),
			VendorID:    uuid.MustParse("b15bcbe6-4fcb-4380-ad65-5b7a668af648"),
			CuisineType: "Japanese",
		},
		{
			ID:          uuid.MustParse("83cee642-0c52-42b3-be52-c5d94a6202c0"),
			VendorID:    uuid.MustParse("b15bcbe6-4fcb-4380-ad65-5b7a668af648"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("f48b74f3-9f11-4b8e-bfc7-98722bbd2e4f"),
			VendorID:    uuid.MustParse("40366ab9-40b9-4d75-aa2b-cf34019f01b1"),
			CuisineType: "Japanese",
		},
		{
			ID:          uuid.MustParse("bee34ff2-847f-4bd0-bee0-09c764c18b33"),
			VendorID:    uuid.MustParse("40366ab9-40b9-4d75-aa2b-cf34019f01b1"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("cfa5af78-48ee-4ddf-a302-3efa944d0c79"),
			VendorID:    uuid.MustParse("0d263604-01e1-4d55-8366-e846d2bda496"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("3990c950-922d-47be-adf4-d643339df2a5"),
			VendorID:    uuid.MustParse("0d263604-01e1-4d55-8366-e846d2bda496"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("38e5e400-025d-4329-a643-8eb10ffa7f92"),
			VendorID:    uuid.MustParse("14059aaa-d6d0-4b00-806e-8f627254e3ea"),
			CuisineType: "Japanese",
		},
		{
			ID:          uuid.MustParse("200ab7a0-707e-4d06-8955-f5482af93d6a"),
			VendorID:    uuid.MustParse("ede0b378-4940-4628-82b0-4ce74170f438"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("7fe7b731-5733-4fc1-8762-863190bc5c38"),
			VendorID:    uuid.MustParse("ede0b378-4940-4628-82b0-4ce74170f438"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("d589a3d5-1323-46fe-80a6-f90f2c2558a5"),
			VendorID:    uuid.MustParse("c05d270d-d87a-468b-b49d-90fd45326e14"),
			CuisineType: "Japanese",
		},
		{
			ID:          uuid.MustParse("f455bf7b-62c5-449e-b515-fb2782fc2002"),
			VendorID:    uuid.MustParse("31683dca-c500-4d8f-9c62-46a9ba5bfabd"),
			CuisineType: "German",
		},
		{
			ID:          uuid.MustParse("678cf64d-e691-4b5e-9b99-2b02f461d93d"),
			VendorID:    uuid.MustParse("31683dca-c500-4d8f-9c62-46a9ba5bfabd"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("733241a7-26c3-41f6-9e52-a43450617383"),
			VendorID:    uuid.MustParse("28f6d56a-b04f-49fd-b072-7c88b2d9c251"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("210b04ff-f5b3-4b92-ac9a-6525ce8dabd2"),
			VendorID:    uuid.MustParse("28f6d56a-b04f-49fd-b072-7c88b2d9c251"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("387f2f44-2f1c-4243-b29e-9dee2afdebb9"),
			VendorID:    uuid.MustParse("c20c73b9-d1e4-4edc-a688-c71df788501b"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("edd20e74-79c0-480a-8963-bac1086c5260"),
			VendorID:    uuid.MustParse("c20c73b9-d1e4-4edc-a688-c71df788501b"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("67f9d5ce-7d09-440e-af67-727b678df6b8"),
			VendorID:    uuid.MustParse("aa49328a-5bc0-4052-a5a6-8e69831c2f94"),
			CuisineType: "German",
		},
		{
			ID:          uuid.MustParse("e6e72445-e7d3-49b4-be32-c3c4f9c06513"),
			VendorID:    uuid.MustParse("81f48ea8-64e8-4e34-a02d-e7fe3fb8df4d"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("4749b4b6-415d-4df0-aa8c-6db8eaca3c02"),
			VendorID:    uuid.MustParse("81f48ea8-64e8-4e34-a02d-e7fe3fb8df4d"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("20aeb96f-a9b4-4fbd-93ad-f79228298b90"),
			VendorID:    uuid.MustParse("b78ad07b-f4bb-43f6-bbde-2c6dc1bb2ec3"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("c1389616-cdac-4357-af44-d350cb8ff39e"),
			VendorID:    uuid.MustParse("b78ad07b-f4bb-43f6-bbde-2c6dc1bb2ec3"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("69d3c41f-052b-4afa-be6d-35a0f3519d88"),
			VendorID:    uuid.MustParse("7b9d9dd5-e443-40de-b257-33b7366cd27e"),
			CuisineType: "Indian",
		},
		{
			ID:          uuid.MustParse("b3c878b9-aea8-4776-a829-690c6c121747"),
			VendorID:    uuid.MustParse("0be4c03e-130a-40fc-9993-8aa2ba08dbfc"),
			CuisineType: "Indian",
		},
		{
			ID:          uuid.MustParse("166f4840-80cf-4131-95f7-48d6164fbca8"),
			VendorID:    uuid.MustParse("71d607f6-0e7b-41a6-8565-e4fc8817c448"),
			CuisineType: "Indian",
		},
		{
			ID:          uuid.MustParse("411e9359-a931-45d5-8f81-56594dc82826"),
			VendorID:    uuid.MustParse("2d0714c0-8ec2-4bf0-8301-90e7b0b15305"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("abc46f78-ae07-4ae3-992a-57b43c9cddc0"),
			VendorID:    uuid.MustParse("2d0714c0-8ec2-4bf0-8301-90e7b0b15305"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("af243182-7a88-4ab6-8cdd-011792db1eab"),
			VendorID:    uuid.MustParse("d87fe13b-f68a-4c5f-87c2-3e9575c4e24b"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("c97794c8-9901-433d-a9ab-489da316cf50"),
			VendorID:    uuid.MustParse("d87fe13b-f68a-4c5f-87c2-3e9575c4e24b"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("f636f783-5168-4be1-b50c-2504bf40db35"),
			VendorID:    uuid.MustParse("638ede6f-e585-419a-9141-1511597bce99"),
			CuisineType: "Indian",
		},
		{
			ID:          uuid.MustParse("ca517f5f-ef65-4b75-bb71-4fdbee689265"),
			VendorID:    uuid.MustParse("0d413a39-2ba6-43a6-a3fd-2caf01b64749"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("c97aae86-e2e3-419a-aa05-64b1faf2807e"),
			VendorID:    uuid.MustParse("0d413a39-2ba6-43a6-a3fd-2caf01b64749"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("4e683781-6586-4582-9bf9-25abf16bb286"),
			VendorID:    uuid.MustParse("9f46f02f-6179-4a5d-8dd8-55303168881e"),
			CuisineType: "American",
		},
		{
			ID:          uuid.MustParse("200e6683-53c2-40c8-a22f-01bc06551a90"),
			VendorID:    uuid.MustParse("621fde6d-7ebe-461a-8073-c57d123fd52d"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("f410f7c7-5003-41f2-8259-73b950aeda55"),
			VendorID:    uuid.MustParse("621fde6d-7ebe-461a-8073-c57d123fd52d"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("bc17c502-540b-477d-a9ce-eb1789624a92"),
			VendorID:    uuid.MustParse("e97fe54b-172c-41f6-9f96-b340f4f4ce7d"),
			CuisineType: "Italian",
		},
		{
			ID:          uuid.MustParse("9bc45fd8-a6e5-4cbf-af9e-3d9609eb8598"),
			VendorID:    uuid.MustParse("a5cdc31d-f8fa-48a5-b4c7-a6c0170c0c73"),
			CuisineType: "American",
		},
		{
			ID:          uuid.MustParse("ea25a138-e5f3-4e4e-8f02-088258b33f6a"),
			VendorID:    uuid.MustParse("3b4e1399-59b3-4bdb-8369-9b92808eecaf"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("5bbfbdf2-c4b5-4b38-ba6f-27d2e4257cbc"),
			VendorID:    uuid.MustParse("3b4e1399-59b3-4bdb-8369-9b92808eecaf"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("f37d24e4-f7cf-4170-bccc-a371773c1464"),
			VendorID:    uuid.MustParse("563b6c42-c6c4-4d5a-b7e8-223658e55d9f"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("39e85fb5-827f-4629-aae5-9e3e8b081f56"),
			VendorID:    uuid.MustParse("563b6c42-c6c4-4d5a-b7e8-223658e55d9f"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("9ae3fcd3-594e-4e83-ab81-d880b9b2d74b"),
			VendorID:    uuid.MustParse("2018afd7-fbb2-4b1d-b9bc-379707fe0048"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("db18aebf-8e01-4f36-af0e-1074346d1805"),
			VendorID:    uuid.MustParse("2018afd7-fbb2-4b1d-b9bc-379707fe0048"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("13ebb5c6-4b32-4767-9a10-c58b80c93df3"),
			VendorID:    uuid.MustParse("20a54a74-dc2d-4be9-bce4-d96525fd6551"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("9d2002e4-c2bc-4b75-b8bb-9e632a4bf6ba"),
			VendorID:    uuid.MustParse("20a54a74-dc2d-4be9-bce4-d96525fd6551"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("4d4ddc75-c8e8-45de-b021-cd309e96aa10"),
			VendorID:    uuid.MustParse("c6cbda03-ebdb-49f3-823b-e604e46122be"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("bf1e6449-6e65-4faa-bd23-11cc56b1f92b"),
			VendorID:    uuid.MustParse("c6cbda03-ebdb-49f3-823b-e604e46122be"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("32f300dc-7d8d-4523-9b93-9a340f744bd7"),
			VendorID:    uuid.MustParse("7733fbea-3c44-4560-a215-b98a34eb2a75"),
			CuisineType: "Greek",
		},
		{
			ID:          uuid.MustParse("d6e41c37-ecba-46b1-87ad-228108d17150"),
			VendorID:    uuid.MustParse("c2fd10a2-4c55-4aa9-8e9b-198197b063b2"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("55fdf981-1f65-4042-ada9-9fe4abdb914d"),
			VendorID:    uuid.MustParse("c2fd10a2-4c55-4aa9-8e9b-198197b063b2"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("f884081d-9bc9-4385-b6b1-9ee85d584c38"),
			VendorID:    uuid.MustParse("52aa067a-a1e3-4fef-b99b-fe24763bb96e"),
			CuisineType: "Italian",
		},
		{
			ID:          uuid.MustParse("cd111cd1-931f-4659-aab3-514601bc06ce"),
			VendorID:    uuid.MustParse("0cffdf9c-9020-48dd-97a7-d20d9ae0b1e6"),
			CuisineType: "Greek",
		},
		{
			ID:          uuid.MustParse("9ea4f7f3-06a8-469e-a56d-a194109a228b"),
			VendorID:    uuid.MustParse("68dfb696-5a88-4cc7-970f-8d42a1d16ee7"),
			CuisineType: "American",
		},
		{
			ID:          uuid.MustParse("4cc056a6-c552-4bfe-bf94-6336ca24ec64"),
			VendorID:    uuid.MustParse("94549d2c-ee68-44bf-9ead-a89204f814de"),
			CuisineType: "Italian",
		},
		{
			ID:          uuid.MustParse("f261953d-8fd8-48a0-810b-9bb66c020508"),
			VendorID:    uuid.MustParse("dd0ccbc4-4b21-49e6-8e0c-aafa386824de"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("4476c90a-bf1a-4f04-9a1f-571aa8d3f1fb"),
			VendorID:    uuid.MustParse("dd0ccbc4-4b21-49e6-8e0c-aafa386824de"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("2fda7bab-bb09-4b37-995d-4a7fe081597f"),
			VendorID:    uuid.MustParse("06a559b1-e6dd-484d-946c-57973f8c77c5"),
			CuisineType: "American",
		},
		{
			ID:          uuid.MustParse("dac151a3-8fcd-458b-aab2-a73ebca5fe3a"),
			VendorID:    uuid.MustParse("7eab8d4e-b8d1-4650-9d77-0a0020a24dd8"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("3edcaec0-0b41-4cbe-80cc-766b3669030a"),
			VendorID:    uuid.MustParse("7eab8d4e-b8d1-4650-9d77-0a0020a24dd8"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("167d23af-be7b-4c09-bf93-c63fd50d8eb0"),
			VendorID:    uuid.MustParse("4f94602f-0229-49d8-bd73-db07eb793ace"),
			CuisineType: "Italian",
		},
		{
			ID:          uuid.MustParse("39e77f59-9266-4f74-a0b6-ec71ed0893f3"),
			VendorID:    uuid.MustParse("7429a93e-9239-40a7-8469-2af44e23feb8"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("985321ba-7443-4f66-a6de-69b3f078f906"),
			VendorID:    uuid.MustParse("7429a93e-9239-40a7-8469-2af44e23feb8"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("5a4a8f60-6655-4dd2-8cc3-db12a591e425"),
			VendorID:    uuid.MustParse("dd1f8167-c0d0-4306-bcf2-d4e3e8840add"),
			CuisineType: "Korean",
		},
		{
			ID:          uuid.MustParse("993a5d69-310a-46f5-9e8e-026970287784"),
			VendorID:    uuid.MustParse("dd1f8167-c0d0-4306-bcf2-d4e3e8840add"),
			CuisineType: "Chinese",
		},
		{
			ID:          uuid.MustParse("46f889b4-f8c3-4ebf-8567-52ba92c64237"),
			VendorID:    uuid.MustParse("a22f5681-b5ec-4775-aa5e-b88703024f7c"),
			CuisineType: "American",
		},
	}

	for _, cuisineType := range cuisineTypes {
		if err := db.CuisineTypesCreate(&cuisineType); err != nil {
			return err
		}
	}

	areas := []database.Areas{
		{
			VendorID: uuid.MustParse("e72ac985-3d7e-47eb-9f0c-f8e52621a708"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("e72ac985-3d7e-47eb-9f0c-f8e52621a708"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d22"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d22"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d23"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d23"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d23"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d23"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d23"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d25"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d25"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d25"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d25"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("06e92326-2f79-4b39-8690-de04314e5d25"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("f4d8a290-da16-4a83-a4b6-2db613887f23"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("f4d8a290-da16-4a83-a4b6-2db613887f23"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("f4d8a290-da16-4a83-a4b6-2db613887f23"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("30f15697-8c12-41cf-83d9-a9ccfe07c43e"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("30f15697-8c12-41cf-83d9-a9ccfe07c43e"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("30f15697-8c12-41cf-83d9-a9ccfe07c43e"),
			AreaName: "Renton",
		},
		{
			VendorID: uuid.MustParse("30f15697-8c12-41cf-83d9-a9ccfe07c43e"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("3531910e-e3e9-4b8b-9a31-d9a55448b956"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("3531910e-e3e9-4b8b-9a31-d9a55448b956"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("3531910e-e3e9-4b8b-9a31-d9a55448b956"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("da1e30f8-f47f-4520-985c-f88d07690337"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("da1e30f8-f47f-4520-985c-f88d07690337"),
			AreaName: "Edmonds",
		},
		{
			VendorID: uuid.MustParse("da1e30f8-f47f-4520-985c-f88d07690337"),
			AreaName: "Everett",
		},
		{
			VendorID: uuid.MustParse("da1e30f8-f47f-4520-985c-f88d07690337"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("21e0878a-3378-449f-abce-82dbf1145ab6"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("21e0878a-3378-449f-abce-82dbf1145ab6"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("21e0878a-3378-449f-abce-82dbf1145ab6"),
			AreaName: "Edmonds",
		},
		{
			VendorID: uuid.MustParse("21e0878a-3378-449f-abce-82dbf1145ab6"),
			AreaName: "Everett",
		},
		{
			VendorID: uuid.MustParse("0cfa988f-eae6-4e28-a4ed-d6df56f23776"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("0cfa988f-eae6-4e28-a4ed-d6df56f23776"),
			AreaName: "Auburn",
		},
		{
			VendorID: uuid.MustParse("0cfa988f-eae6-4e28-a4ed-d6df56f23776"),
			AreaName: "Shoreline",
		},
		{
			VendorID: uuid.MustParse("0cfa988f-eae6-4e28-a4ed-d6df56f23776"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("da700177-e738-4651-9889-3025bf634ee0"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("da700177-e738-4651-9889-3025bf634ee0"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("da700177-e738-4651-9889-3025bf634ee0"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("da700177-e738-4651-9889-3025bf634ee0"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("6fe864a4-3de8-4ca4-9f10-38bceb3a8d52"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("6fe864a4-3de8-4ca4-9f10-38bceb3a8d52"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("6fe864a4-3de8-4ca4-9f10-38bceb3a8d52"),
			AreaName: "Edmonds",
		},
		{
			VendorID: uuid.MustParse("29b074e4-f335-4787-b798-dc832056e16f"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("29b074e4-f335-4787-b798-dc832056e16f"),
			AreaName: "Shoreline",
		},
		{
			VendorID: uuid.MustParse("29b074e4-f335-4787-b798-dc832056e16f"),
			AreaName: "Kenmore",
		},
		{
			VendorID: uuid.MustParse("c28c2a93-36af-44dc-a90d-c01090a09836"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("c28c2a93-36af-44dc-a90d-c01090a09836"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("c28c2a93-36af-44dc-a90d-c01090a09836"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("3becace8-89f5-4bc6-9379-8f84e891cd1d"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("3becace8-89f5-4bc6-9379-8f84e891cd1d"),
			AreaName: "Mountlake Terrace",
		},
		{
			VendorID: uuid.MustParse("ec54fe44-f045-4f89-bbb2-e65278032a78"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("ec54fe44-f045-4f89-bbb2-e65278032a78"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("105fab9b-dc74-44b0-baea-c6cb2fdddd77"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("eb52a586-9bf9-49b8-ab53-66b1622d4c16"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("eb52a586-9bf9-49b8-ab53-66b1622d4c16"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("eb52a586-9bf9-49b8-ab53-66b1622d4c16"),
			AreaName: "Edmonds",
		},
		{
			VendorID: uuid.MustParse("8ee2c22e-6379-4954-b004-d747652ea755"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("8ee2c22e-6379-4954-b004-d747652ea755"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("8ee2c22e-6379-4954-b004-d747652ea755"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("17dbed88-4248-4453-a32b-e1a3a8361740"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("17dbed88-4248-4453-a32b-e1a3a8361740"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("17dbed88-4248-4453-a32b-e1a3a8361740"),
			AreaName: "Kenmore",
		},
		{
			VendorID: uuid.MustParse("ae72ac38-df76-4f0b-a7b2-3942c24482aa"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("ae72ac38-df76-4f0b-a7b2-3942c24482aa"),
			AreaName: "Federal Way",
		},
		{
			VendorID: uuid.MustParse("613bc5c5-a3b3-4db4-b1c1-fc7bd5ff119f"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("613bc5c5-a3b3-4db4-b1c1-fc7bd5ff119f"),
			AreaName: "Auburn",
		},
		{
			VendorID: uuid.MustParse("94ba0158-df11-4a8a-a3c7-60f7d022c2db"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("94ba0158-df11-4a8a-a3c7-60f7d022c2db"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("94ba0158-df11-4a8a-a3c7-60f7d022c2db"),
			AreaName: "Everett",
		},
		{
			VendorID: uuid.MustParse("4b77070b-a507-4a63-90b1-115fa3f6d658"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("4b77070b-a507-4a63-90b1-115fa3f6d658"),
			AreaName: "Shoreline",
		},
		{
			VendorID: uuid.MustParse("4b77070b-a507-4a63-90b1-115fa3f6d658"),
			AreaName: "Kenmore",
		},
		{
			VendorID: uuid.MustParse("09d8b204-1b5c-4203-b174-d44eda838a0e"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("09d8b204-1b5c-4203-b174-d44eda838a0e"),
			AreaName: "Renton",
		},
		{
			VendorID: uuid.MustParse("09d8b204-1b5c-4203-b174-d44eda838a0e"),
			AreaName: "Kent",
		},
		{
			VendorID: uuid.MustParse("46b9c2c3-ca38-4409-b292-2f84c44d6b07"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("46b9c2c3-ca38-4409-b292-2f84c44d6b07"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("52fe8350-e7c7-48dc-b4ea-25e900a19161"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("52fe8350-e7c7-48dc-b4ea-25e900a19161"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("52fe8350-e7c7-48dc-b4ea-25e900a19161"),
			AreaName: "Edmonds",
		},
		{
			VendorID: uuid.MustParse("d2f3bba7-7e1c-4125-a5d5-7c2677f9978b"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("d2f3bba7-7e1c-4125-a5d5-7c2677f9978b"),
			AreaName: "Mountlake Terrace",
		},
		{
			VendorID: uuid.MustParse("ab291625-c232-4a7a-88c1-c6c260e25fbb"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("ab291625-c232-4a7a-88c1-c6c260e25fbb"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("e3b9f317-8f31-4439-a10e-fb104bf89d87"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("e3b9f317-8f31-4439-a10e-fb104bf89d87"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("02a30d0f-f6e9-4564-b881-3a8dc6d9523e"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("02a30d0f-f6e9-4564-b881-3a8dc6d9523e"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("638c5fda-98c6-4af3-9034-32c122905d73"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("638c5fda-98c6-4af3-9034-32c122905d73"),
			AreaName: "Edmonds",
		},
		{
			VendorID: uuid.MustParse("b2ecce1d-7ad0-4613-ad2e-ced6e57347b5"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("b2ecce1d-7ad0-4613-ad2e-ced6e57347b5"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("b2ecce1d-7ad0-4613-ad2e-ced6e57347b5"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("b2ecce1d-7ad0-4613-ad2e-ced6e57347b5"),
			AreaName: "Kenmore",
		},
		{
			VendorID: uuid.MustParse("65282dca-80e6-4689-b1db-d6e7411399f8"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("65282dca-80e6-4689-b1db-d6e7411399f8"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("65282dca-80e6-4689-b1db-d6e7411399f8"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("883d983f-8d95-435c-8af2-f9f6222c6b46"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("883d983f-8d95-435c-8af2-f9f6222c6b46"),
			AreaName: "Shoreline",
		},
		{
			VendorID: uuid.MustParse("883d983f-8d95-435c-8af2-f9f6222c6b46"),
			AreaName: "Kenmore",
		},
		{
			VendorID: uuid.MustParse("71801960-6ad6-4a98-8701-c4a233665e25"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("71801960-6ad6-4a98-8701-c4a233665e25"),
			AreaName: "Edmonds",
		},
		{
			VendorID: uuid.MustParse("71801960-6ad6-4a98-8701-c4a233665e25"),
			AreaName: "Shoreline",
		},
		{
			VendorID: uuid.MustParse("ebb44ffb-10e3-49ad-b0c9-94db68ba0d1c"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("ebb44ffb-10e3-49ad-b0c9-94db68ba0d1c"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("ebb44ffb-10e3-49ad-b0c9-94db68ba0d1c"),
			AreaName: "Auburn",
		},
		{
			VendorID: uuid.MustParse("44ebc1b8-bb85-4f42-872e-5321c36cc147"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("44ebc1b8-bb85-4f42-872e-5321c36cc147"),
			AreaName: "Federal Way",
		},
		{
			VendorID: uuid.MustParse("a2cca59f-0c04-446e-8ab3-d39eeba2b255"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("a2cca59f-0c04-446e-8ab3-d39eeba2b255"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("659dbe78-7523-4c12-8df6-7f9652fb6397"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("659dbe78-7523-4c12-8df6-7f9652fb6397"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("0f50e68a-83ad-4765-978c-033cea348aad"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("0f50e68a-83ad-4765-978c-033cea348aad"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("0f50e68a-83ad-4765-978c-033cea348aad"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("cd68d890-876d-43e9-9bb1-fcf954bf0931"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("cd68d890-876d-43e9-9bb1-fcf954bf0931"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("033d2218-28bd-4472-87e8-6598cd4af28f"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("8e2ba32b-a491-4a55-bd17-a6592980b0ad"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("8e2ba32b-a491-4a55-bd17-a6592980b0ad"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("8e2ba32b-a491-4a55-bd17-a6592980b0ad"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("56a1122b-bf47-403a-ac4a-7268f8da4a38"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("56a1122b-bf47-403a-ac4a-7268f8da4a38"),
			AreaName: "Auburn",
		},
		{
			VendorID: uuid.MustParse("56a1122b-bf47-403a-ac4a-7268f8da4a38"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("0b2f894d-280d-47bb-870d-c92786b1b77e"),
			AreaName: "Mountlake Terrace",
		},
		{
			VendorID: uuid.MustParse("d72b253e-4925-4735-ac08-74e34e1e8181"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("d72b253e-4925-4735-ac08-74e34e1e8181"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("ed3d88c2-e4bd-41de-babc-7e321af8405f"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("ed3d88c2-e4bd-41de-babc-7e321af8405f"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("ed3d88c2-e4bd-41de-babc-7e321af8405f"),
			AreaName: "Edmonds",
		},
		{
			VendorID: uuid.MustParse("ed3d88c2-e4bd-41de-babc-7e321af8405f"),
			AreaName: "Everett",
		},
		{
			VendorID: uuid.MustParse("ed3d88c2-e4bd-41de-babc-7e321af8405f"),
			AreaName: "Shoreline",
		},
		{
			VendorID: uuid.MustParse("138e277a-2ff7-490f-a206-38200fe5b841"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("138e277a-2ff7-490f-a206-38200fe5b841"),
			AreaName: "Everett",
		},
		{
			VendorID: uuid.MustParse("138e277a-2ff7-490f-a206-38200fe5b841"),
			AreaName: "Shoreline",
		},
		{
			VendorID: uuid.MustParse("b185e9c0-3b94-4f22-9141-499863d00e08"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("b185e9c0-3b94-4f22-9141-499863d00e08"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("4e0874f8-53df-4522-8dce-8b2d874aa879"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("4e0874f8-53df-4522-8dce-8b2d874aa879"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("d1baa338-2aef-4524-ba34-d7e389149237"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("d1baa338-2aef-4524-ba34-d7e389149237"),
			AreaName: "Edmonds",
		},
		{
			VendorID: uuid.MustParse("22a8bb71-2a6d-4ba6-83ef-d00dee3743fa"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("22a8bb71-2a6d-4ba6-83ef-d00dee3743fa"),
			AreaName: "Kenmore",
		},
		{
			VendorID: uuid.MustParse("9171e802-6d09-4519-92dd-3d7251caddba"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("9171e802-6d09-4519-92dd-3d7251caddba"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("9171e802-6d09-4519-92dd-3d7251caddba"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("9171e802-6d09-4519-92dd-3d7251caddba"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("45f29539-5b5a-4c7b-97b1-d923ba920533"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("45f29539-5b5a-4c7b-97b1-d923ba920533"),
			AreaName: "Renton",
		},
		{
			VendorID: uuid.MustParse("45f29539-5b5a-4c7b-97b1-d923ba920533"),
			AreaName: "Kent",
		},
		{
			VendorID: uuid.MustParse("c838f3d5-438d-4a62-8b5e-d59d67b16656"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("c838f3d5-438d-4a62-8b5e-d59d67b16656"),
			AreaName: "Everett",
		},
		{
			VendorID: uuid.MustParse("c838f3d5-438d-4a62-8b5e-d59d67b16656"),
			AreaName: "Shoreline",
		},
		{
			VendorID: uuid.MustParse("c838f3d5-438d-4a62-8b5e-d59d67b16656"),
			AreaName: "Kenmore",
		},
		{
			VendorID: uuid.MustParse("a1fa8ee2-42f1-464d-9418-9d295aec544d"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("a1fa8ee2-42f1-464d-9418-9d295aec544d"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("a1fa8ee2-42f1-464d-9418-9d295aec544d"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("69359153-3078-4e48-ad6a-eb5db9c1c5ec"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("69359153-3078-4e48-ad6a-eb5db9c1c5ec"),
			AreaName: "Everett",
		},
		{
			VendorID: uuid.MustParse("69359153-3078-4e48-ad6a-eb5db9c1c5ec"),
			AreaName: "Shoreline",
		},
		{
			VendorID: uuid.MustParse("69359153-3078-4e48-ad6a-eb5db9c1c5ec"),
			AreaName: "North Creek",
		},
		{
			VendorID: uuid.MustParse("27b846d6-d49b-424f-a705-3d4dab18d3f2"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("27b846d6-d49b-424f-a705-3d4dab18d3f2"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("27b846d6-d49b-424f-a705-3d4dab18d3f2"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("27b846d6-d49b-424f-a705-3d4dab18d3f2"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("8adc7c79-3277-466a-a77f-34f81a2deab7"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("8adc7c79-3277-466a-a77f-34f81a2deab7"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("e4161fa3-b949-4a32-b3c2-21388bb29611"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("e4161fa3-b949-4a32-b3c2-21388bb29611"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("c4bb2615-7e0c-43bb-afdc-4f43e58a76fc"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("c4bb2615-7e0c-43bb-afdc-4f43e58a76fc"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("b15bcbe6-4fcb-4380-ad65-5b7a668af648"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("b15bcbe6-4fcb-4380-ad65-5b7a668af648"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("40366ab9-40b9-4d75-aa2b-cf34019f01b1"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("40366ab9-40b9-4d75-aa2b-cf34019f01b1"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("40366ab9-40b9-4d75-aa2b-cf34019f01b1"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("0d263604-01e1-4d55-8366-e846d2bda496"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("0d263604-01e1-4d55-8366-e846d2bda496"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("0d263604-01e1-4d55-8366-e846d2bda496"),
			AreaName: "Edmonds",
		},
		{
			VendorID: uuid.MustParse("0d263604-01e1-4d55-8366-e846d2bda496"),
			AreaName: "Everett",
		},
		{
			VendorID: uuid.MustParse("14059aaa-d6d0-4b00-806e-8f627254e3ea"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("14059aaa-d6d0-4b00-806e-8f627254e3ea"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("14059aaa-d6d0-4b00-806e-8f627254e3ea"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("14059aaa-d6d0-4b00-806e-8f627254e3ea"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("ede0b378-4940-4628-82b0-4ce74170f438"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("ede0b378-4940-4628-82b0-4ce74170f438"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("ede0b378-4940-4628-82b0-4ce74170f438"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("ede0b378-4940-4628-82b0-4ce74170f438"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("c05d270d-d87a-468b-b49d-90fd45326e14"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("c05d270d-d87a-468b-b49d-90fd45326e14"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("c05d270d-d87a-468b-b49d-90fd45326e14"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("31683dca-c500-4d8f-9c62-46a9ba5bfabd"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("31683dca-c500-4d8f-9c62-46a9ba5bfabd"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("31683dca-c500-4d8f-9c62-46a9ba5bfabd"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("31683dca-c500-4d8f-9c62-46a9ba5bfabd"),
			AreaName: "Auburn",
		},
		{
			VendorID: uuid.MustParse("31683dca-c500-4d8f-9c62-46a9ba5bfabd"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("28f6d56a-b04f-49fd-b072-7c88b2d9c251"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("28f6d56a-b04f-49fd-b072-7c88b2d9c251"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("28f6d56a-b04f-49fd-b072-7c88b2d9c251"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("28f6d56a-b04f-49fd-b072-7c88b2d9c251"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("c20c73b9-d1e4-4edc-a688-c71df788501b"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("c20c73b9-d1e4-4edc-a688-c71df788501b"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("c20c73b9-d1e4-4edc-a688-c71df788501b"),
			AreaName: "Auburn",
		},
		{
			VendorID: uuid.MustParse("c20c73b9-d1e4-4edc-a688-c71df788501b"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("aa49328a-5bc0-4052-a5a6-8e69831c2f94"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("aa49328a-5bc0-4052-a5a6-8e69831c2f94"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("aa49328a-5bc0-4052-a5a6-8e69831c2f94"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("aa49328a-5bc0-4052-a5a6-8e69831c2f94"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("81f48ea8-64e8-4e34-a02d-e7fe3fb8df4d"),
			AreaName: "Edmonds",
		},
		{
			VendorID: uuid.MustParse("81f48ea8-64e8-4e34-a02d-e7fe3fb8df4d"),
			AreaName: "Everett",
		},
		{
			VendorID: uuid.MustParse("81f48ea8-64e8-4e34-a02d-e7fe3fb8df4d"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("81f48ea8-64e8-4e34-a02d-e7fe3fb8df4d"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("b78ad07b-f4bb-43f6-bbde-2c6dc1bb2ec3"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("b78ad07b-f4bb-43f6-bbde-2c6dc1bb2ec3"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("b78ad07b-f4bb-43f6-bbde-2c6dc1bb2ec3"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("b78ad07b-f4bb-43f6-bbde-2c6dc1bb2ec3"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("7b9d9dd5-e443-40de-b257-33b7366cd27e"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("7b9d9dd5-e443-40de-b257-33b7366cd27e"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("7b9d9dd5-e443-40de-b257-33b7366cd27e"),
			AreaName: "Edmonds",
		},
		{
			VendorID: uuid.MustParse("7b9d9dd5-e443-40de-b257-33b7366cd27e"),
			AreaName: "Shoreline",
		},
		{
			VendorID: uuid.MustParse("7b9d9dd5-e443-40de-b257-33b7366cd27e"),
			AreaName: "Kenmore",
		},
		{
			VendorID: uuid.MustParse("0be4c03e-130a-40fc-9993-8aa2ba08dbfc"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("0be4c03e-130a-40fc-9993-8aa2ba08dbfc"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("0be4c03e-130a-40fc-9993-8aa2ba08dbfc"),
			AreaName: "Edmonds",
		},
		{
			VendorID: uuid.MustParse("0be4c03e-130a-40fc-9993-8aa2ba08dbfc"),
			AreaName: "Everett",
		},
		{
			VendorID: uuid.MustParse("0be4c03e-130a-40fc-9993-8aa2ba08dbfc"),
			AreaName: "Shoreline",
		},
		{
			VendorID: uuid.MustParse("0be4c03e-130a-40fc-9993-8aa2ba08dbfc"),
			AreaName: "Kenmore",
		},
		{
			VendorID: uuid.MustParse("71d607f6-0e7b-41a6-8565-e4fc8817c448"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("71d607f6-0e7b-41a6-8565-e4fc8817c448"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("71d607f6-0e7b-41a6-8565-e4fc8817c448"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("71d607f6-0e7b-41a6-8565-e4fc8817c448"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("2d0714c0-8ec2-4bf0-8301-90e7b0b15305"),
			AreaName: "Edmonds",
		},
		{
			VendorID: uuid.MustParse("2d0714c0-8ec2-4bf0-8301-90e7b0b15305"),
			AreaName: "Everett",
		},
		{
			VendorID: uuid.MustParse("d87fe13b-f68a-4c5f-87c2-3e9575c4e24b"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("d87fe13b-f68a-4c5f-87c2-3e9575c4e24b"),
			AreaName: "Snohomish",
		},
		{
			VendorID: uuid.MustParse("d87fe13b-f68a-4c5f-87c2-3e9575c4e24b"),
			AreaName: "Edmonds",
		},
		{
			VendorID: uuid.MustParse("d87fe13b-f68a-4c5f-87c2-3e9575c4e24b"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("d87fe13b-f68a-4c5f-87c2-3e9575c4e24b"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("638ede6f-e585-419a-9141-1511597bce99"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("638ede6f-e585-419a-9141-1511597bce99"),
			AreaName: "Snohomish",
		},
		{
			VendorID: uuid.MustParse("0d413a39-2ba6-43a6-a3fd-2caf01b64749"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("0d413a39-2ba6-43a6-a3fd-2caf01b64749"),
			AreaName: "Snohomish",
		},
		{
			VendorID: uuid.MustParse("0d413a39-2ba6-43a6-a3fd-2caf01b64749"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("0d413a39-2ba6-43a6-a3fd-2caf01b64749"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("9f46f02f-6179-4a5d-8dd8-55303168881e"),
			AreaName: "Mill Creek",
		},
		{
			VendorID: uuid.MustParse("9f46f02f-6179-4a5d-8dd8-55303168881e"),
			AreaName: "Snohomish",
		},
		{
			VendorID: uuid.MustParse("9f46f02f-6179-4a5d-8dd8-55303168881e"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("9f46f02f-6179-4a5d-8dd8-55303168881e"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("621fde6d-7ebe-461a-8073-c57d123fd52d"),
			AreaName: "Auburn",
		},
		{
			VendorID: uuid.MustParse("621fde6d-7ebe-461a-8073-c57d123fd52d"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("621fde6d-7ebe-461a-8073-c57d123fd52d"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("621fde6d-7ebe-461a-8073-c57d123fd52d"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("e97fe54b-172c-41f6-9f96-b340f4f4ce7d"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("e97fe54b-172c-41f6-9f96-b340f4f4ce7d"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("a5cdc31d-f8fa-48a5-b4c7-a6c0170c0c73"),
			AreaName: "Shoreline",
		},
		{
			VendorID: uuid.MustParse("a5cdc31d-f8fa-48a5-b4c7-a6c0170c0c73"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("a5cdc31d-f8fa-48a5-b4c7-a6c0170c0c73"),
			AreaName: "Kenmore",
		},
		{
			VendorID: uuid.MustParse("a5cdc31d-f8fa-48a5-b4c7-a6c0170c0c73"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("3b4e1399-59b3-4bdb-8369-9b92808eecaf"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("3b4e1399-59b3-4bdb-8369-9b92808eecaf"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("3b4e1399-59b3-4bdb-8369-9b92808eecaf"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("563b6c42-c6c4-4d5a-b7e8-223658e55d9f"),
			AreaName: "Shoreline",
		},
		{
			VendorID: uuid.MustParse("563b6c42-c6c4-4d5a-b7e8-223658e55d9f"),
			AreaName: "Kenmore",
		},
		{
			VendorID: uuid.MustParse("563b6c42-c6c4-4d5a-b7e8-223658e55d9f"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("2018afd7-fbb2-4b1d-b9bc-379707fe0048"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("2018afd7-fbb2-4b1d-b9bc-379707fe0048"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("2018afd7-fbb2-4b1d-b9bc-379707fe0048"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("2018afd7-fbb2-4b1d-b9bc-379707fe0048"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("2018afd7-fbb2-4b1d-b9bc-379707fe0048"),
			AreaName: "Lynnwood",
		},
		{
			VendorID: uuid.MustParse("20a54a74-dc2d-4be9-bce4-d96525fd6551"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("20a54a74-dc2d-4be9-bce4-d96525fd6551"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("20a54a74-dc2d-4be9-bce4-d96525fd6551"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("c6cbda03-ebdb-49f3-823b-e604e46122be"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("c6cbda03-ebdb-49f3-823b-e604e46122be"),
			AreaName: "Mountlake Terrace",
		},
		{
			VendorID: uuid.MustParse("7733fbea-3c44-4560-a215-b98a34eb2a75"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("7733fbea-3c44-4560-a215-b98a34eb2a75"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("7733fbea-3c44-4560-a215-b98a34eb2a75"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("c2fd10a2-4c55-4aa9-8e9b-198197b063b2"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("c2fd10a2-4c55-4aa9-8e9b-198197b063b2"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("c2fd10a2-4c55-4aa9-8e9b-198197b063b2"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("52aa067a-a1e3-4fef-b99b-fe24763bb96e"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("52aa067a-a1e3-4fef-b99b-fe24763bb96e"),
			AreaName: "Federal Way",
		},
		{
			VendorID: uuid.MustParse("0cffdf9c-9020-48dd-97a7-d20d9ae0b1e6"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("0cffdf9c-9020-48dd-97a7-d20d9ae0b1e6"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("0cffdf9c-9020-48dd-97a7-d20d9ae0b1e6"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("0cffdf9c-9020-48dd-97a7-d20d9ae0b1e6"),
			AreaName: "Edmonds",
		},
		{
			VendorID: uuid.MustParse("0cffdf9c-9020-48dd-97a7-d20d9ae0b1e6"),
			AreaName: "Everett",
		},
		{
			VendorID: uuid.MustParse("68dfb696-5a88-4cc7-970f-8d42a1d16ee7"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("68dfb696-5a88-4cc7-970f-8d42a1d16ee7"),
			AreaName: "Renton",
		},
		{
			VendorID: uuid.MustParse("68dfb696-5a88-4cc7-970f-8d42a1d16ee7"),
			AreaName: "Kent",
		},
		{
			VendorID: uuid.MustParse("94549d2c-ee68-44bf-9ead-a89204f814de"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("94549d2c-ee68-44bf-9ead-a89204f814de"),
			AreaName: "Federal Way",
		},
		{
			VendorID: uuid.MustParse("dd0ccbc4-4b21-49e6-8e0c-aafa386824de"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("dd0ccbc4-4b21-49e6-8e0c-aafa386824de"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("dd0ccbc4-4b21-49e6-8e0c-aafa386824de"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("06a559b1-e6dd-484d-946c-57973f8c77c5"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("06a559b1-e6dd-484d-946c-57973f8c77c5"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("7eab8d4e-b8d1-4650-9d77-0a0020a24dd8"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("7eab8d4e-b8d1-4650-9d77-0a0020a24dd8"),
			AreaName: "Mountlake Terrace",
		},
		{
			VendorID: uuid.MustParse("4f94602f-0229-49d8-bd73-db07eb793ace"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("4f94602f-0229-49d8-bd73-db07eb793ace"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("7429a93e-9239-40a7-8469-2af44e23feb8"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("7429a93e-9239-40a7-8469-2af44e23feb8"),
			AreaName: "Bellevue",
		},
		{
			VendorID: uuid.MustParse("7429a93e-9239-40a7-8469-2af44e23feb8"),
			AreaName: "Bothell",
		},
		{
			VendorID: uuid.MustParse("7429a93e-9239-40a7-8469-2af44e23feb8"),
			AreaName: "Redmond",
		},
		{
			VendorID: uuid.MustParse("7429a93e-9239-40a7-8469-2af44e23feb8"),
			AreaName: "Kirkland",
		},
		{
			VendorID: uuid.MustParse("dd1f8167-c0d0-4306-bcf2-d4e3e8840add"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("dd1f8167-c0d0-4306-bcf2-d4e3e8840add"),
			AreaName: "Mountlake Terrace",
		},
		{
			VendorID: uuid.MustParse("a22f5681-b5ec-4775-aa5e-b88703024f7c"),
			AreaName: "Seattle",
		},
		{
			VendorID: uuid.MustParse("a22f5681-b5ec-4775-aa5e-b88703024f7c"),
			AreaName: "Shoreline",
		},
		{
			VendorID: uuid.MustParse("a22f5681-b5ec-4775-aa5e-b88703024f7c"),
			AreaName: "Kenmore",
		},
	}

	for _, area := range areas {
		if err := db.AreasCreate(&area); err != nil {
			return err
		}
	}

	guide := database.Guide{
		ID: uuid.MustParse("112ec037-6d63-43c0-8937-0dcc605a5417"),
		Guide: `According to all known laws of aviation, there is no way a bee should be able to fly.
				Its wings are too small to get its fat little body off the ground.
				The bee, of course, flies anyway because bees don't care what humans think is impossible.`,
		DatePosted:    time.Date(2022, 1, 24, 22, 20, 0, 0, time.UTC),
		ArticleAuthor: "Jerry Seinfeld",
	}

	if err := db.GuideCreate(&guide); err != nil {
		return err
	}

	photos := []database.Photo{
		{
			ID:         "8aa0c090-86c2-41f7-b7b7-7d4750f9c48f.jpg",
			Text:       "Tots-in-a-Blanket Burrito",
			DatePosted: time.Date(2022, 2, 14, 0, 0, 0, 0, time.UTC),
			LinkID:     uuid.MustParse("e72ac985-3d7e-47eb-9f0c-f8e52621a708"),
		},
		{
			ID:         "e313a731-0228-4b01-ac98-8e2f9c2f2e9e.jpg",
			Text:       "French Toast",
			DatePosted: time.Date(2022, 2, 14, 0, 0, 0, 0, time.UTC),
			LinkID:     uuid.MustParse("e72ac985-3d7e-47eb-9f0c-f8e52621a708"),
		},
	}

	for _, photo := range photos {
		if err := db.PhotoCreate(&photo); err != nil {
			return err
		}
	}

	return nil
}
