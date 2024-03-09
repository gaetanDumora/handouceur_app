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
init_output=$(vault operator init -key-shares=1 -key-threshold=1)
# Extract unseal keys and initial root token from the output
unseal_key=$(echo "$init_output" | grep 'Unseal Key 1:' | awk '{print $NF}')
root_token=$(echo "$init_output" | grep 'Initial Root Token:' | awk '{print $NF}')

# Unseal the vault
vault operator unseal $unseal_key
# Login as root to enable all secret engines
vault login $root_token

vault secrets enable transit
vault audit enable file file_path=/vault/logs/audit.log

# Write policies to being able to store and read keys sent by vault-leader 
vault policy write autounseal /vault/policies/auto-unseal-policy.hcl
# Generate token for vault-leader to access to keys
vault write -f transit/keys/autounseal
auto_unseal_token=$(vault token create -orphan -policy="autounseal" -format=json | jq -r ".auth.client_token")

echo "Unseal Key: $unseal_key" >> secrets.txt
echo "Root Token: $root_token" >> secrets.txt
echo "Auto unseal Token: $auto_unseal_token" >> secrets.txt

# Keep the container running
tail -f /dev/null