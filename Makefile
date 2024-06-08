TAG ?= vault
VAULT_DIR := kubernetes/charts/vault

.PHONY: release-cert-manager release-vault kill-vault

release-cert-manager:
	helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.3.1 --set installCRDs=true
	kubectl apply -f cluster-certs.yml

release-vault:
	kubectl apply -f ${VAULT_DIR}/configmap.yml 
	helm upgrade --install ${TAG} hashicorp/vault --values ${VAULT_DIR}/${TAG}-values.yml --namespace ${TAG}
	./scripts/retrieve-secrets.sh ${TAG}
	kubectl exec -n ${TAG} ${TAG}-1 -it -- vault operator unseal

kill-vault:
	helm uninstall ${TAG} --namespace ${TAG}
	kubectl delete configmaps --all --namespace ${TAG}
	kubectl delete secrets --all --namespace ${TAG}
	kubectl delete persistentvolumeclaim --all --namespace ${TAG}