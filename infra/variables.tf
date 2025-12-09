variable "aws_region" {
  default = "us-east-1"
}

variable "instance_type" {
  default = "t3.micro"
}

variable "key_name" {
  description = "EC2 key pair name"
}

variable "project_name" {
  default = "task-tracker-ci-cd"
}

variable "github_repo_url" {
  description = "Your GitHub repo URL"
}
