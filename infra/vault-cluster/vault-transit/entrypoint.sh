#!/bin/sh

vault server -config=/vault/config/config.hcl &

sleep 5

printf "\n%s" \
"[vault_transit] initializing and capturing the unseal key and root token" \
""
sleep 2 # Added for human readability

INIT_RESPONSE=$(vault operator init -format=json -key-shares 1 -key-threshold 1)

UNSEAL_KEY=$(echo "$INIT_RESPONSE" | jq -r .unseal_keys_b64[0])
VAULT_TOKEN=$(echo "$INIT_RESPONSE" | jq -r .root_token)

printf "\n%s" \
"[vault_transit] unsealing and logging in" \
""
sleep 2 # Added for human readability

vault operator unseal "$UNSEAL_KEY"
vault login "$VAULT_TOKEN"

printf "\n%s" \
"[vault_transit] enabling the transit secret engine and creating a key to auto-unseal vault cluster" \
""
sleep 5 # Added for human readability

vault secrets enable transit
vault write -f transit/keys/unseal_key
vault audit enable file file_path=/vault/logs/audit.log

# # Write policies to being able to store and read keys sent by vault-leader 
vault policy write autounseal /vault/policies/auto-unseal-policy.hcl
# Generate token others vaults to access their keys
vault write -f transit/keys/autounseal
AUTO_UNSEAL_TOKEN=$(vault token create -orphan -policy="autounseal" -format=json | jq -r ".auth.client_token")

echo "Unseal Key: $UNSEAL_KEY" >> secrets.txt
echo "Root Token: $VAULT_TOKEN" >> secrets.txt
echo "Auto Unseal Token: $AUTO_UNSEAL_TOKEN" >> secrets.txt
cat secrets.txt

# Keep the container running
tail -f /dev/null