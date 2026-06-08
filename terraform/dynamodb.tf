resource "aws_dynamodb_table" "deployments" {
  name         = "Deployments"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "deploymentId"

  attribute {
    name = "deploymentId"
    type = "S"
  }

  tags = {
    Project = "Serverless Progressive Delivery Platform"
  }
}