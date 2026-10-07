variable "account_id" {
  description = "Cloudflare account ID."
  type        = string
}

variable "zone_id" {
  description = "Zone ID of the domain."
  type        = string
}

variable "domain" {
  description = "Apex domain that serves the site."
  type        = string
  default     = "jpatrickbeal.com"
}

variable "worker_name" {
  description = "Name of the Worker deployed by wrangler (the `name` in wrangler.jsonc)."
  type        = string
  default     = "patrick-beal"
}

variable "dev_worker_name" {
  description = "Name of the dev Worker (`env.dev.name` in wrangler.jsonc). Served at dev.<domain>."
  type        = string
  default     = "patrick-beal-dev"
}
