#!/bin/bash
# Script to run the server in EC2 instance
cd /home/ec2-user/backend
aws configure set region us-west-2
COMMIT_ID=$(aws deploy get-deployment --deployment-id $DEPLOYMENT_ID --query 'deploymentInfo.revision.gitHubLocation.commitId')
echo "${COMMIT_ID}" > version.json
SECRETS_FILE=/home/ec2-user/secrets.json sudo -E go run . &> log &
