#!/bin/sh
apk update
apk add jq
apk add curl
# Start Vault server in the background
vault server -config=/vault/config/config.hcl  &

# Wait for Vault to be ready
check_vault_ready() {
    curl -sk -o /dev/null "https://localhost:8200/v1/sys/health"
}
# Wait for Vault to be ready
while ! check_vault_ready; do
    echo "Vault is not ready yet. Waiting..."
    sleep 5
done

echo "Vault is ready. Initializing..."

# Run the vault operator init command and capture the output
init_output=$(vault operator init)
root_token=$(echo "$init_output" | grep 'Initial Root Token:' | awk '{print $NF}')

# Login as root to enable all secret engines
vault login $root_token

# Enabler
vault secrets enable -path=kv kv-v2
vault secrets enable -path=database database
vault auth enable approle
vault audit enable file file_path=/vault/logs/audit.log

# Write policies
vault policy write nodejs-app /vault/policies/app-policy.hcl
vault policy write admin /vault/policies/admin-policy.hcl

# Setup vault role in postgres
vault write database/config/postgres \
        plugin_name="postgresql-database-plugin" \
        allowed_roles="*" \
        connection_url="postgresql://{{username}}:{{password}}@postgres/handouceur?sslmode=require" \
        username="vault" \
        password="vault" \
        password_authentication="scram-sha-256"
# Immediately rotate secret
vault write -force database/rotate-root/postgres
# Add app roles in postgres (have to match with vault policies)
vault write database/roles/ro \
        db_name="postgres" \
        creation_statements="CREATE USER \"{{name}}\" WITH LOGIN PASSWORD '{{password}}' NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION VALID UNTIL '{{expiration}}'; GRANT SELECT ON ALL TABLES IN SCHEMA public TO \"{{name}}\";" \
        revocation_statements="REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM \"{{name}}\"; DROP OWNED BY \"{{name}}\"; DROP ROLE \"{{name}}\";" \
        default_ttl=1h \
        max_ttl=24h


vault write database/roles/rwd \
        db_name="postgres" \
        creation_statements="CREATE USER \"{{name}}\" WITH LOGIN PASSWORD '{{password}}' NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION VALID UNTIL '{{expiration}}'; GRANT SELECT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO \"{{name}}\";" \
        revocation_statements="REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM \"{{name}}\"; DROP OWNED BY \"{{name}}\"; DROP ROLE \"{{name}}\";" \
        default_ttl=1h \
        max_ttl=24h

# Generate token for human admin
admin_token=$(vault token create -format=json -policy="admin" | jq -r ".auth.client_token")

# Create role for my Node.js app
vault write auth/approle/role/nodejs-app \
    token_policies="nodejs-app" \
    token_ttl=1h \
    token_max_ttl=24h

# Generate secrets for my Node.js app (no ttl)
app_role_id=$(vault read auth/approle/role/nodejs-app/role-id -format=json | jq -r ".data.role_id")
app_secret_id=$(vault write -force auth/approle/role/nodejs-app/secret-id -format=json| jq -r ".data.secret_id")
# Store them in kv secrets
vault kv put kv/app role_id=$app_role_id secret_id=$app_secret_id

echo "Admin Token: $admin_token" >> /vault/secrets.txt
echo "App RoleId: $app_role_id" >> /vault/secrets.txt
echo "App SecretId: $app_secret_id" >> /vault/secrets.txt
echo "$init_output" >> /vault/secrets.txt

# Keep the container running
tail -f /dev/null
