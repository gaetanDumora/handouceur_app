FROM hashicorp/vault:latest

RUN apk update \
    && apk add --no-cache jq curl

COPY entrypoint.sh /vault
COPY config.hcl /vault/config/
COPY auto-unseal-policy.hcl /vault/policies/

EXPOSE 8200

ENTRYPOINT ["/bin/sh", "/vault/entrypoint.sh"]