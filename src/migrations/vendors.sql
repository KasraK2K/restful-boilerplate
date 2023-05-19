--================================================================
--
--  ##   ##  #####  ##     ##  ####     #####   #####     ####
--  ##   ##  ##     ####   ##  ##  ##  ##   ##  ##  ##   ##
--  ##   ##  #####  ##  ## ##  ##  ##  ##   ##  #####     ###
--   ## ##   ##     ##    ###  ##  ##  ##   ##  ##  ##      ##
--    ###    #####  ##     ##  ####     #####   ##   ##  ####
--
--================================================================


CREATE TABLE IF NOT EXISTS vendors
(
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL DEFAULT '',
    image            VARCHAR(100) NOT NULL DEFAULT '',
    email            VARCHAR(100) NOT NULL DEFAULT '',
    address_line1    VARCHAR(100) NOT NULL DEFAULT '',
    address_line2    VARCHAR(100) NOT NULL DEFAULT '',
    address_city     VARCHAR(100) NOT NULL DEFAULT '',
    address_country  VARCHAR(100) NOT NULL DEFAULT '',
    address_postcode VARCHAR(100) NOT NULL DEFAULT '',
    contact_number   VARCHAR(100) NOT NULL DEFAULT '',
    description      TEXT         NOT NULL DEFAULT '',
    tags             TEXT[]       NOT NULL DEFAULT '{}',

    is_archive       BOOLEAN               DEFAULT FALSE,

    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    archived_at      TIMESTAMP
);

-- Create Update Trigger
CREATE TRIGGER set_timestamp
    BEFORE UPDATE
    ON "vendors"
    FOR EACH ROW
EXECUTE PROCEDURE trg_timestamp();