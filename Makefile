NS ?= vault
VAULT_DIR := kubernetes/charts/vault
UNSEAL_KEY := $(shell jq -r '.unseal_key' ${VAULT_DIR}/secret-${NS}.json 2> /dev/null)

.PHONY: init-ns release-vault start-vault

init-ns:
	kubectl create namespace vault
	kubectl create namespace vault-tt

release-vault:
	kubectl apply -f ${VAULT_DIR}/configmap.yml --namespace ${NS}
	kubectl create secret generic vault-ha-tls --namespace ${NS} --from-file=vault.key=${VAULT_DIR}/certs/vault.key --from-file=vault.crt=${VAULT_DIR}/certs/vault.crt --from-file=vault.ca=${VAULT_DIR}/certs/vault.ca
	helm upgrade --install ${NS} hashicorp/vault --values ${VAULT_DIR}/${NS}-values.yml --namespace ${NS}

start-vault:
	rm -f ${VAULT_DIR}/secret-${NS}.json
	kubectl exec ${NS}-0 --namespace ${NS} -- ./vault/scripts/${NS}.sh | grep -oE '{.*}' | sed 's/\x1b\[[0-9;]*m//g' > ${VAULT_DIR}/secret-${NS}.json
	kubectl exec ${NS}-1 --namespace ${NS} -ti -- vault operator unseal

kill-vault:
	helm uninstall ${NS} -n ${NS}
	kubectl delete -n ${NS} configmap vault-setup
	kubectl delete -n ${NS} secret vault-ha-tls
	kubectl delete -n ${NS} persistentvolumeclaim data-${NS}-0
	kubectl delete -n ${NS} persistentvolumeclaim data-${NS}-1