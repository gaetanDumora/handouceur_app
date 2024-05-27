
# network interface and port that Vault will listen on for incoming API requests
listener "tcp" {
  address            = "0.0.0.0:8200"
  cluster_address    = "0.0.0.0:8201"
  tls_cert_file      = "/vault/certs/server-cert.pem"
  tls_key_file       = "/vault/certs/server-key.pem"
  tls_client_ca_file = "/vault/certs/ca-cert.pem"
  tls_disable        = false
}

# distributed storage
storage "raft" {
  path    = "/vault/data"
  node_id = "vault"
  retry_join {
    leader_api_addr         = "https://vault:8200"
    leader_client_cert_file = "/vault/certs/server-cert.pem"
    leader_client_key_file  = "/vault/certs/server-key.pem"
    leader_ca_cert_file     = "/vault/certs/ca-cert.pem"
  }
  retry_join {
    leader_api_addr         = "https://vault-slave:8200"
    leader_client_cert_file = "/vault/certs/server-cert.pem"
    leader_client_key_file  = "/vault/certs/server-key.pem"
    leader_ca_cert_file     = "/vault/certs/ca-cert.pem"
  }
  retry_join {
    leader_api_addr         = "https://vault-slave:8200"
    leader_client_cert_file = "/vault/certs/server-cert.pem"
    leader_client_key_file  = "/vault/certs/server-key.pem"
    leader_ca_cert_file     = "/vault/certs/ca-cert.pem"
  }
}

audit "file" {
  path = "/vault/logs/audit.log"
}

# manage auto unseal, backed by the follower
seal "transit" {
  address         = "https://vault-transit:8200"
  token           = ""
  disable_renewal = false
  key_name        = "autounseal"
  mount_path      = "transit/"
  tls_skip_verify = false
}

disable_mlock = true
ui            = true // localhost:8200/ui/
log_level     = "debug"
api_addr      = "https://vault:8200"

cluster_addr = "https://vault:8201"