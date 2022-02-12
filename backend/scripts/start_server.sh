#!/bin/bash
# Script to run the server in EC2 instance
cd /home/ec2-user/backend
echo '"deploy test"' > version.json
echo "\"${DEPLOYMENT_ID}\"" > version.json
aws configure set region us-west-2
aws deploy get-deployment --deployment-id $DEPLOYMENT_ID
aws deploy get-deployment --deployment-id $DEPLOYMENT_ID --query 'revision.gitHubLocation.commitId'
SECRETS_FILE=/home/ec2-user/secrets.json sudo -E go run . &> log &
