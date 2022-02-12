#!/bin/bash
# Script to run the server in EC2 instance
cd /home/ec2-user/backend
SECRETS_FILE=/home/ec2-user/secrets.json sudo -E go run . &
