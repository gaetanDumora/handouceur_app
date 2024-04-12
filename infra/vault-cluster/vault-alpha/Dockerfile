FROM hashicorp/vault:latest

COPY config.hcl /vault/config/

EXPOSE 8200

ENTRYPOINT ["vault", "server", "-config=/vault/config/config.hcl"]