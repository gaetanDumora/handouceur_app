
# network interface and port that Vault will listen on for incoming API requests
listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "/vault/certs/selfsigned.crt"
  tls_key_file  = "/vault/certs/selfsigned.key"
  tls_disable   = false
}

# distributed storage
storage "raft" {
  path    = "/vault/data"
  node_id = "vault-leader"
}

audit "file" {
  path = "/vault/logs/audit.log"
}

# manage auto unseal leader, backed by the follower
seal "transit" {
  address         = "https://vault-follower:8200"
  token           = "hvs.CAESIL05PbHUIG7Mh8rwmYWzdC8vG9lJKrqBiXi5TQOfzxbSGh4KHGh2cy5jM0pxaEJyUW5WWGw1cTZlY3ZXc1FJc1M"
  disable_renewal = "false"
  key_name        = "autounseal"
  mount_path      = "transit/"
  tls_skip_verify = "false"
}

disable_mlock = true
ui            = true // localhost:8200/ui/
log_level     = "debug"
api_addr      = "https://127.0.0.1:8200"

cluster_addr = "https://vault-leader:8201"