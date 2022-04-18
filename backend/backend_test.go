package main

import (
	"github.com/bcfoodapp/streetfoodlove/database"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestSelectReviewsAftertime(t *testing.T) {
	tests := []struct {
		reviews   []database.Review
		afterTime time.Time
		expected  []database.Review
	}{
		{
			nil,
			time.Date(0, 0, 0, 0, 0, 1, 0, time.UTC),
			nil,
		},
		{
			[]database.Review{
				{
					DatePosted: time.Date(0, 0, 0, 0, 0, 0, 0, time.UTC),
				},
			},
			time.Date(0, 0, 0, 0, 0, 1, 0, time.UTC),
			nil,
		},
		{
			[]database.Review{
				{
					DatePosted: time.Date(0, 0, 0, 0, 0, 0, 0, time.UTC),
				},
				{
					DatePosted: time.Date(0, 0, 0, 0, 0, 2, 0, time.UTC),
				},
			},
			time.Date(0, 0, 0, 0, 0, 1, 0, time.UTC),
			[]database.Review{
				{
					DatePosted: time.Date(0, 0, 0, 0, 0, 2, 0, time.UTC),
				},
			},
		},
	}

	for i, test := range tests {
		assert.Equal(t, test.expected, selectReviewsAfterTime(test.reviews, test.afterTime), i)
	}
}
