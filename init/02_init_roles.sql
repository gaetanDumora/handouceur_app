-- Create a read only user
CREATE ROLE user_read WITH LOGIN PASSWORD '$POSTGRES_READ_PASSWORD' NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;

GRANT
SELECT
  ON ALL TABLES IN SCHEMA public TO user_read;

-- Create a limited user
CREATE ROLE limited_user WITH LOGIN PASSWORD '$POSTGRES_LIMITED_USER_PASSWORD';

-- Revoke all privileges on all tables in the schema
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public
FROM
  limited_user;

-- Grant usage on the schema
GRANT USAGE ON SCHEMA public TO limited_user;