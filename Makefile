VAULT_TRANSIT_DIR := kubernetes/charts/vault-transit
JSON_TRANSIT_SECRET := ${VAULT_TRANSIT_DIR}/secret-transit.json
UNSEAL_KEY := $(shell jq -r '.unseal_key' ${JSON_TRANSIT_SECRET} 2> /dev/null)

.PHONY: deploy-vault-transit start-vault-transit

deploy-vault-transit:
	kubectl apply -f ${VAULT_TRANSIT_DIR}/configmap.yml
	helm upgrade --install vault hashicorp/vault --values ${VAULT_TRANSIT_DIR}/values.yml
start-vault-transit:
	rm -f ${JSON_TRANSIT_SECRET}
	kubectl exec vault-0 -- ./vault/scripts/setup.sh | grep -oE '{.*}' | sed 's/\x1b\[[0-9;]*m//g' > ${JSON_TRANSIT_SECRET}
	kubectl exec vault-1 -ti -- vault operator unseal ${UNSEAL_KEY}

