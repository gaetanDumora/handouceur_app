FROM hashicorp/vault:latest

COPY entrypoint.sh /vault
COPY config.hcl /vault/config/
COPY auto-unseal-policy.hcl /vault/policies/

EXPOSE 8100

ENTRYPOINT ["/bin/sh", "/vault/entrypoint.sh"]