terraform {
  required_version = ">= 1.6"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }

  # State lives in a private Cloudflare R2 bucket, never in this repo.
  # Bucket, endpoint and credentials are supplied at init time (see README.md).
  backend "s3" {
    key                         = "jpatrickbeal-com/terraform.tfstate"
    region                      = "auto"
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
    use_path_style              = true
  }
}

# Authenticates with the CLOUDFLARE_API_TOKEN environment variable.
provider "cloudflare" {}
