# The Worker itself (code and static assets) is deployed by wrangler, not Terraform.
# deploy.yml publishes it first, then applies this, so the custom domain has a target.

locals {
  prod     = var.environment == "prod"
  hostname = local.prod ? var.domain : "dev.${var.domain}"
  service  = local.prod ? var.worker_name : var.dev_worker_name
}

# Serve the environment on its hostname. Cloudflare creates the DNS record and certificate.
# dev is never indexable (see scripts/smoke.sh); prod is.
resource "cloudflare_workers_custom_domain" "site" {
  account_id = var.account_id
  zone_id    = var.zone_id
  hostname   = local.hostname
  service    = local.service
}

# A proxied placeholder record so Cloudflare receives www requests and can redirect them.
# 192.0.2.1 is a reserved documentation address; traffic never reaches it. Prod only.
resource "cloudflare_dns_record" "www" {
  count = local.prod ? 1 : 0

  zone_id = var.zone_id
  name    = "www"
  type    = "A"
  content = "192.0.2.1"
  proxied = true
  ttl     = 1
  comment = "Placeholder. www is redirected to the apex by the www_to_apex ruleset."
}

resource "cloudflare_ruleset" "www_to_apex" {
  count = local.prod ? 1 : 0

  zone_id     = var.zone_id
  name        = "www to apex"
  description = "Redirect www.${var.domain} to ${var.domain}"
  kind        = "zone"
  phase       = "http_request_dynamic_redirect"

  rules = [{
    action      = "redirect"
    description = "301 www to apex, keeping path and query"
    expression  = "(http.host eq \"www.${var.domain}\")"
    enabled     = true
    action_parameters = {
      from_value = {
        status_code           = 301
        preserve_query_string = true
        target_url = {
          expression = "concat(\"https://${var.domain}\", http.request.uri.path)"
        }
      }
    }
  }]
}
