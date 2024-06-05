NS ?= vault
VAULT_DIR := kubernetes/charts/vault
SECRET_CERTS_NAME := cluster-certificate

.PHONY: release-cert-manager release-vault start-vault kill-vault

release-cert-manager:
	helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.3.1 --set installCRDs=true

release-vault:
	kubectl apply -f ${VAULT_DIR}/configmap.yml --namespace ${NS}
	helm upgrade --install ${NS} hashicorp/vault --values ${VAULT_DIR}/${NS}-values.yml --namespace ${NS}

start-vault:
	rm -f ${VAULT_DIR}/secret-${NS}.json
	kubectl exec ${NS}-0 --namespace ${NS} -- ./vault/scripts/${NS}.sh | grep -oE '{.*}' | sed 's/\x1b\[[0-9;]*m//g' > ${VAULT_DIR}/secret-${NS}.json
	kubectl exec ${NS}-1 --namespace ${NS} -ti -- vault operator unseal

kill-vault:
	helm uninstall ${NS} -n ${NS}
	kubectl delete -n ${NS} configmaps --all
	kubectl delete -n ${NS} secrets --all
	kubectl delete -n ${NS} persistentvolumeclaim --all 