resource "aws_s3_bucket" "artifacts" {
  bucket = "progressive-delivery-artifacts-tushya"

  tags = {
    Project = "Serverless Progressive Delivery Platform"
  }
}