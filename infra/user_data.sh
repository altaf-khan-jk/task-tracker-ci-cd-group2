#!/bin/bash
set -xe

# Update system
sudo apt-get update -y

# Install tools
sudo apt-get install -y curl git unzip

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone GitHub repo
cd /opt
sudo git clone "${GITHUB_REPO_URL}" app || (cd app && sudo git pull)
cd app

# Install dependencies
sudo npm install

# Start app
sudo nohup npm start > /opt/app.log 2>&1 &

# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Create CloudWatch config
sudo tee /opt/aws/amazon-cloudwatch-agent.json > /dev/null <<EOF
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/opt/app.log",
            "log_group_name": "/task-tracker-ci-cd/app",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  }
}
EOF

# Start CloudWatch agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent.json -s
