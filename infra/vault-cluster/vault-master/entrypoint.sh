#!/bin/sh
vault server -config=/vault/config/config.hcl  &

sleep 5

printf "\n%s" \
"[vault_2] initializing and capturing the recovery key and root token" \
""
sleep 2 # Added for human readability

# Initialize the second node and capture its recovery keys and root token
INIT_RESPONSE=$(vault operator init -format=json -recovery-shares 1 -recovery-threshold 1)

RECOVERY_KEY=$(echo "$INIT_RESPONSE" | jq -r .recovery_keys_b64[0])
VAULT_TOKEN=$(echo "$INIT_RESPONSE" | jq -r .root_token)

printf "\n%s" \
"[vault_2] waiting to finish post-unseal setup (5 seconds)" \
""

sleep 5

printf "\n%s" \
"[vault_2] logging in and enabling the KV secrets engine" \
""
sleep 2 # Added for human readability

printf "\n%s" \
"[vault_2] login with root token" \
""
vault login "$VAULT_TOKEN"

# Enabler
printf "\n%s" \
"[vault_2] enable secret engines" \
""
vault secrets enable -path=kv kv-v2
sleep 2
vault secrets enable -path=database database
sleep 2
vault auth enable approle
sleep 2
vault audit enable file file_path=/vault/logs/audit.log

# Write policies
printf "\n%s" \
"[vault_2] write policies" \
""
vault policy write nodejs-app /vault/policies/app-policy.hcl
vault policy write admin /vault/policies/admin-policy.hcl
sleep 2

# Setup vault role in postgres
printf "\n%s" \
"[vault_2] setup database engine, and configure roles" \
""
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
        creation_statements="CREATE USER \"{{name}}\" WITH LOGIN PASSWORD '{{password}}' NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION VALID UNTIL '{{expiration}}'; GRANT INSERT, SELECT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO \"{{name}}\";" \
        revocation_statements="REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM \"{{name}}\"; DROP OWNED BY \"{{name}}\"; DROP ROLE \"{{name}}\";" \
        default_ttl=1h \
        max_ttl=24h

sleep 2
# Generate token for human admin
ADMIN_TOKEN=$(vault token create -format=json -policy="admin" | jq -r ".auth.client_token")

# Create role for my Node.js app
vault write auth/approle/role/nodejs-app \
    token_policies="nodejs-app" \
    token_ttl=1h \
    token_max_ttl=24h

# Generate secrets for my Node.js app (no ttl)
APP_ROLE_ID=$(vault read auth/approle/role/nodejs-app/role-id -format=json | jq -r ".data.role_id")
APP_ROLE_SECRET=$(vault write -force auth/approle/role/nodejs-app/secret-id -format=json| jq -r ".data.secret_id")
# Store them in kv secrets
vault kv put kv/app role_id=$APP_ROLE_ID secret_id=$APP_ROLE_SECRET

echo "Admin Token: $ADMIN_TOKEN" >> secrets.txt
echo "App RoleId: $APP_ROLE_ID" >> secrets.txt
echo "App SecretId: $APP_ROLE_SECRET" >> secrets.txt
echo "Rercovery Key: $RECOVERY_KEY" >> secrets.txt
echo "Vault Token: $VAULT_TOKEN" >> secrets.txt
cat secrets.txt

# Keep the container running
tail -f /dev/null
