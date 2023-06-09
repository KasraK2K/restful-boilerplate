--========================================================================================================
--
--  #####    #####   #####    ######    ###    ##                ##   ##   ####  #####  #####     ####
--  ##  ##  ##   ##  ##  ##     ##     ## ##   ##                ##   ##  ##     ##     ##  ##   ##
--  #####   ##   ##  #####      ##    ##   ##  ##                ##   ##   ###   #####  #####     ###
--  ##      ##   ##  ##  ##     ##    #######  ##                ##   ##     ##  ##     ##  ##      ##
--  ##       #####   ##   ##    ##    ##   ##  ######  ########   #####   ####   #####  ##   ##  ####
--
--========================================================================================================


CREATE TABLE IF NOT EXISTS portal_users
(
    id                SERIAL PRIMARY KEY,
    email             VARCHAR(50)  NOT NULL UNIQUE,
    password          VARCHAR(200) NOT NULL DEFAULT '',
    contact_number    VARCHAR(50)  NOT NULL DEFAULT '',
    first_name        VARCHAR(50)  NOT NULL DEFAULT '',
    surname           VARCHAR(50)  NOT NULL DEFAULT '',
    gender            gender                DEFAULT 'OTHER',

    is_active         BOOLEAN               DEFAULT TRUE,
    is_admin          BOOLEAN               DEFAULT FALSE,
    is_archive        BOOLEAN               DEFAULT FALSE,

    business_name     VARCHAR(100) NOT NULL DEFAULT '',
    business_category VARCHAR(100) NOT NULL DEFAULT '',
    business_size     VARCHAR(100) NOT NULL DEFAULT '',
    role_id           INT          NOT NULL DEFAULT 0, -- this is role key
    reseller_id       INT          NOT NULL DEFAULT 0, -- 0 is general reseller

    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    archived_at       TIMESTAMP
);

-- Create Update Trigger
CREATE TRIGGER set_timestamp
    BEFORE UPDATE
    ON "portal_users"
    FOR EACH ROW
EXECUTE PROCEDURE trg_timestamp();

-- Create Indexes
CREATE INDEX "portal_users_reseller_id" ON "portal_users" ("reseller_id");

-- Password is 12345678 and hashed by bcryptjs salt 7
INSERT INTO portal_users
(email, password, contact_number,
 first_name, surname, gender, is_admin)
VALUES ('b@b.com', '$2a$07$r66gkFrxBP5L5/XSd4No4eY.Z/UGu.56F/neHhsLjAwydlPvUnocO', '09123456789',
        'bahram', 'badri', 'MALE', TRUE);

SELECT *
FROM portal_users;