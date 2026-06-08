output "s3_bucket_name" {
  value = aws_s3_bucket.artifacts.bucket
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.deployments.name
}

output "sns_topic_arn" {
  value = aws_sns_topic.deployment_notifications.arn
}