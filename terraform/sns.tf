resource "aws_sns_topic" "deployment_notifications" {
  name = "deployment-notifications"

  tags = {
    Project = "Serverless Progressive Delivery Platform"
  }
}