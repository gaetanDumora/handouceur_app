listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "/vault/certs/selfsigned.crt"
  tls_key_file  = "/vault/certs/selfsigned.key"
  tls_disable   = false
}

audit "file" {
  path = "/vault/logs/audit.log"
}

storage "raft" {
  path    = "/vault/data"
  node_id = "vault-follower"
}

disable_mlock = true
ui            = true
log_level     = "debug"
api_addr      = "https://127.0.0.1:8200"

cluster_addr = "https://vault-follower:8201"