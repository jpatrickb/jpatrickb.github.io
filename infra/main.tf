# The Worker itself (code and static assets) is deployed by wrangler, not Terraform.
# Deploy it once before the first `terraform apply` so the custom domain has a target.

# Serve the site on the apex domain. Cloudflare creates the DNS record and certificate.
resource "cloudflare_workers_custom_domain" "apex" {
  account_id = var.account_id
  zone_id    = var.zone_id
  hostname   = var.domain
  service    = var.worker_name
}

# The dev environment: develop deploys here. It is not indexable (see scripts/smoke.sh).
resource "cloudflare_workers_custom_domain" "dev" {
  account_id = var.account_id
  zone_id    = var.zone_id
  hostname   = "dev.${var.domain}"
  service    = var.dev_worker_name
}

# A proxied placeholder record so Cloudflare receives www requests and can redirect them.
# 192.0.2.1 is a reserved documentation address; traffic never reaches it.
resource "cloudflare_dns_record" "www" {
  zone_id = var.zone_id
  name    = "www"
  type    = "A"
  content = "192.0.2.1"
  proxied = true
  ttl     = 1
  comment = "Placeholder. www is redirected to the apex by the www_to_apex ruleset."
}

resource "cloudflare_ruleset" "www_to_apex" {
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
