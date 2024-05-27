# Base image
FROM hashicorp/vault:latest as base

ARG BASE=./infra/vault-cluster
ARG PORT=8200
RUN apk update && apk add --no-cache jq openssl
ENV VAULT_ADDR=https://127.0.0.1:$PORT
EXPOSE $PORT

FROM base as vault
COPY $BASE/vault.entrypoint.sh /vault/entrypoint.sh
COPY $BASE/vault.config.hcl /vault/config/config.hcl
COPY $BASE/vault.policy.hcl /vault/policies/
ENTRYPOINT ["/bin/sh", "/vault/entrypoint.sh"]

FROM base as transit
COPY $BASE/transit.entrypoint.sh /vault/entrypoint.sh
COPY $BASE/transit.config.hcl /vault/config/config.hcl
COPY $BASE/transit.policy.hcl /vault/policies/
ENTRYPOINT ["/bin/sh", "/vault/entrypoint.sh"]

FROM base as slave1
COPY $BASE/vault.slave.config.hcl /vault/config/config.hcl
ENTRYPOINT ["vault", "server", "-config=/vault/config/config.hcl"]

FROM base as slave2
COPY $BASE/vault.slave1.config.hcl /vault/config/config.hcl
ENTRYPOINT ["vault", "server", "-config=/vault/config/config.hcl"]
