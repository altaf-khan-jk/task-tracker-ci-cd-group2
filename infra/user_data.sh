#!/bin/bash
set -xe

apt-get update -y
apt-get install -y curl git unzip

curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

cd /opt
git clone ${GITHUB_REPO_URL} app || (cd app && git pull)
cd app
npm install

nohup npm start > app.log 2>&1 &
