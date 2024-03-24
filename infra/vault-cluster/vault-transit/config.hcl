listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "/vault/certs/selfsigned.crt"
  tls_key_file  = "/vault/certs/selfsigned.key"
  tls_disable   = true
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
api_addr      = "http://vault-transit:8200"