FROM hashicorp/vault:latest

RUN apk update \
    && apk add --no-cache jq openssl

COPY entrypoint.sh /vault
COPY config.hcl /vault/config/
COPY app-policy.hcl /vault/policies/

EXPOSE 8200

ENTRYPOINT ["/bin/sh", "/vault/entrypoint.sh"]