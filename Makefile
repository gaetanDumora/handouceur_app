NS ?= vault
VAULT_DIR := kubernetes/charts/vault
UNSEAL_KEY := $(shell jq -r '.unseal_key' ${VAULT_DIR}/secret-${NS}.json 2> /dev/null)

.PHONY: init-ns deploy-vault-transit start-vault-transit

init-ns:
	kubectl create namespace vault
	kubectl create namespace vault-tt

deploy-vault:
	kubectl apply -f ${VAULT_DIR}/configmap.yml --namespace ${NS}
	helm upgrade --install ${NS} hashicorp/vault --values ${VAULT_DIR}/${NS}-values.yml --namespace ${NS}

start-vault:
	rm -f ${VAULT_DIR}/secret-${NS}.json
	kubectl exec ${NS}-0 --namespace ${NS} -- ./vault/scripts/${NS}.sh | grep -oE '{.*}' | sed 's/\x1b\[[0-9;]*m//g' > ${VAULT_DIR}/secret-${NS}.json
	kubectl exec ${NS}-1 --namespace ${NS} -ti -- vault operator unseal

kill-vault:
	helm uninstall ${NS} -n ${NS}
	kubectl delete -n ${NS} configmap vault-setup
	kubectl delete -n ${NS} persistentvolumeclaim data-${NS}-0
	kubectl delete -n ${NS} persistentvolumeclaim data-${NS}-1