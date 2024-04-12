#!/bin/sh 
rm *.pem
rm *.srl
# Generate CA's private key and self-signed certificate
openssl req -x509 -newkey rsa:4096 -days 365 -nodes -keyout ca-key.pem -out ca-cert.pem -subj "/CN=*/emailAddress=dev@gmail.com/C=FR/ST=Rhone/L=Lyon/O=development/OU=local development/"

echo "CA's self-signed certificate"
openssl x509 -in ca-cert.pem -noout -text

# Generate web server's private key and certificate signing request (CSR)
openssl req -newkey rsa:4096 -nodes -keyout server-key.pem -out server-req.pem -subj "/CN=*/emailAddress=server@gmail.com/C=FR/ST=Rhone/L=Lyon/O=developmentCSR/OU=local developmentCSR/"

# Use CA's private key to sign web server's CSR and get back the signed certificate
openssl x509 -req -in server-req.pem -days 365 -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem -extfile server-ext.cnf

echo "Server signed certificate"
openssl x509 -in server-cert.pem -noout -text
openssl verify -CAfile ca-cert.pem server-cert.pem