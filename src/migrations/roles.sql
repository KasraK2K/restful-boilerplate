--============================================
--
--  #####     #####   ##      #####   ####
--  ##  ##   ##   ##  ##      ##     ##
--  #####    ##   ##  ##      #####   ###
--  ##  ##   ##   ##  ##      ##        ##
--  ##   ##   #####   ######  #####  ####
--
--============================================


CREATE TABLE IF NOT EXISTS roles
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL DEFAULT '',
    permission  VARCHAR(50) NOT NULL DEFAULT '',

    is_archive  BOOLEAN              DEFAULT FALSE,

    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    archived_at TIMESTAMP
);

-- Create Update Trigger
CREATE TRIGGER set_timestamp
    BEFORE UPDATE
    ON "roles"
    FOR EACH ROW
EXECUTE PROCEDURE trg_timestamp();