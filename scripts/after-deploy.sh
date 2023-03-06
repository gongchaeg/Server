#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY

sudo /usr/bin/yarn
sudo /usr/bin/yarn db:pull
sudo /usr/bin/pm2 start dist
