--=========================================================================
--
--  #####    #####   ####  #####  ##      ##      #####  #####     ####
--  ##  ##   ##     ##     ##     ##      ##      ##     ##  ##   ##
--  #####    #####   ###   #####  ##      ##      #####  #####     ###
--  ##  ##   ##        ##  ##     ##      ##      ##     ##  ##      ##
--  ##   ##  #####  ####   #####  ######  ######  #####  ##   ##  ####
--
--=========================================================================


CREATE TABLE IF NOT EXISTS resellers
(
    id                     SERIAL PRIMARY KEY,
    name                   VARCHAR(100)  NOT NULL DEFAULT '',
    email                  VARCHAR(100)  NOT NULL DEFAULT '',
    point_of_contact_phone VARCHAR(100)  NOT NULL DEFAULT '',
    point_of_contact_name  VARCHAR(100)  NOT NULL DEFAULT '',
    business_name          VARCHAR(100)  NOT NULL DEFAULT '',
    business_category      VARCHAR(100)  NOT NULL DEFAULT '',
    business_address       json          NOT NULL DEFAULT '{}',
    solutions              int[]         NOT NULL DEFAULT '{}',
    password               VARCHAR(100)  NOT NULL DEFAULT '',
    working_hours          JSON          NOT NULL DEFAULT '{}',
    time_slots             VARCHAR(50)[] NOT NULL DEFAULT '{}',
    services_category      VARCHAR(50)[] NOT NULL DEFAULT '{}',
    website                VARCHAR(100)  NOT NULL DEFAULT '',
    description            TEXT          NOT NULL DEFAULT '',
    organisation_code      VARCHAR(100)  NOT NULL DEFAULT '',
    type                   int           NOT Null DEFAULT 0, -- 0: Admin, 1: Channel, 2: Vendor, 3: Associate

    is_active              BOOLEAN                DEFAULT TRUE,
    is_archive             BOOLEAN                DEFAULT FALSE,

    created_at             TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at             TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    archived_at            TIMESTAMP
);

-- Create Update Trigger
CREATE TRIGGER set_timestamp
    BEFORE UPDATE
    ON "resellers"
    FOR EACH ROW
EXECUTE PROCEDURE trg_timestamp();