
# network interface and port that Vault will listen on for incoming API requests
listener "tcp" {
  address         = "0.0.0.0:8200"
  cluster_address = "0.0.0.0:8201"
  tls_cert_file   = "/vault/certs/selfsigned.crt"
  tls_key_file    = "/vault/certs/selfsigned.key"
  tls_disable     = true
}

# distributed storage
storage "raft" {
  path    = "/vault/data"
  node_id = "vault-master"
}

audit "file" {
  path = "/vault/logs/audit.log"
}

# manage auto unseal master, backed by the follower
seal "transit" {
  address         = "http://vault-transit:8200"
  token           = "" // token from vault transit
  disable_renewal = false
  key_name        = "autounseal"
  mount_path      = "transit/"
  tls_skip_verify = true
}

disable_mlock = true
ui            = true // localhost:8200/ui/
log_level     = "debug"
api_addr      = "http://vault-master:8200"

cluster_addr = "http://vault-master:8201"