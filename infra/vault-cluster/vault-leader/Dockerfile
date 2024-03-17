FROM hashicorp/vault:latest

COPY entrypoint.sh /vault
COPY config.hcl /vault/config/
COPY admin-policy.hcl /vault/policies/
COPY app-policy.hcl /vault/policies/

EXPOSE 8200

ENTRYPOINT ["/bin/sh", "/vault/entrypoint.sh"]