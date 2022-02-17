package main

import (
	"context"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sts"
	"github.com/aws/aws-sdk-go-v2/service/sts/types"
)

type AWS struct {
	client sts.Client
}

func NewAWS() (*AWS, error) {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		return &AWS{}, err
	}

	return &AWS{client: *sts.NewFromConfig(cfg)}, nil
}

func (a *AWS) GetS3Role() (*types.Credentials, error) {
	params := &sts.AssumeRoleInput{
		RoleArn:         aws.String("arn:aws:iam::082691565476:role/SFLPhotoUpload"),
		RoleSessionName: aws.String("streetfoodlove"),
		DurationSeconds: aws.Int32(900),
	}

	response, err := a.client.AssumeRole(context.Background(), params)
	if err != nil {
		return nil, err
	}

	return response.Credentials, nil
}
