ALTER SYSTEM
SET
    ssl_cert_file TO '/var/lib/postgresql/certs/cert.pem';

ALTER SYSTEM
SET
    ssl_key_file TO '/var/lib/postgresql/certs/private.pem';

ALTER SYSTEM
SET
    ssl TO 'ON';