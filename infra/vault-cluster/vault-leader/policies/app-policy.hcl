# Allow access to login, using the auth/approle/login endpoint by passing the RoleID and SecretID
path "auth/approle/login" {
  capabilities = ["update"]
}

path "kv/data/app" {
  capabilities = ["read"]
}

# Allow reading the AppRole role ID
path "auth/approle/role/nodejs-app/role-id" {
  capabilities = ["read"]
}

# Allow generating database credentials for specific roles
path "database/creds/ro" {
  capabilities = ["update", "read"]
}

# Allow generating database credentials for specific roles (if needed)
path "database/creds/rwd" {
  capabilities = ["update", "read"]
}