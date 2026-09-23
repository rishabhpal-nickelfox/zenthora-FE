How to generate valid certificate:
1)keytool -genkeypair -alias localhost -keyalg RSA -keysize 2048 -validity 3650 -keystore ui-localhost.p12 -storetype PKCS12 -dname "CN=localhost, OU=IT, O=Localhost Dev" -ext "SAN=DNS:localhost,IP:127.0.0.1"
2)openssl pkcs12 -in ui-localhost.p12 -nocerts -out key.pem -nodes
3)openssl pkcs12 -in ui-localhost.p12 -nokeys -out cert.pem
4)copy it to spring boot backend app


ui-localhost.p12 -file for spring boot BE. Password: 123456
You need to import ui-localhost.crt to Root Trusted Certs
