#!/bin/bash
# Script to run the server in EC2 instance
cd /home/ec2-user/backend
go build .
SECRETS_FILE=/home/ec2-user/secrets.json sudo -E ./streetfoodlove &> log &
