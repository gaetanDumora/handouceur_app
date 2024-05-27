listener "tcp" {
  address            = "0.0.0.0:8200"
  tls_cert_file      = "/vault/certs/server-cert.pem"
  tls_key_file       = "/vault/certs/server-key.pem"
  tls_client_ca_file = "/vault/certs/ca-cert.pem"
  tls_disable        = false
}

audit "file" {
  path = "/vault/logs/audit.log"
}

storage "file" {
  path = "/vault/data"
}

disable_mlock = true
ui            = true
log_level     = "debug"
api_addr      = "https://vault-transit:8200"