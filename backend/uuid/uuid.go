package uuid

import (
	"database/sql/driver"
	"encoding/json"
	"github.com/google/uuid"
)

// UUID is a wrapper for uuid.UUID.
type UUID uuid.UUID

func Parse(s string) (UUID, error) {
	u, err := uuid.Parse(s)
	return UUID(u), err
}

func MustParse(s string) UUID {
	u, err := Parse(s)
	if err != nil {
		panic(err)
	}
	return u
}

func (u UUID) Value() (driver.Value, error) {
	return u[:], nil
}

func (u *UUID) Scan(src interface{}) error {
	return (*uuid.UUID)(u).Scan(src)
}

func (u *UUID) MarshalJSON() ([]byte, error) {
	return json.Marshal((*uuid.UUID)(u).String())
}

func (u *UUID) UnmarshalJSON(b []byte) error {
	return json.Unmarshal(b, (*uuid.UUID)(u))
}
