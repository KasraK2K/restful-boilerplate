--========================================================================
--
--  #####  #####  #####  ####    #####     ###     ####  ##  ##   ####
--  ##     ##     ##     ##  ##  ##  ##   ## ##   ##     ## ##   ##
--  #####  #####  #####  ##  ##  #####   ##   ##  ##     ####     ###
--  ##     ##     ##     ##  ##  ##  ##  #######  ##     ## ##      ##
--  ##     #####  #####  ####    #####   ##   ##   ####  ##  ##  ####
--
--========================================================================


CREATE TABLE IF NOT EXISTS feedbacks
(
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(100) NOT NULL DEFAULT '',
    email          VARCHAR(100) NOT NULL DEFAULT '',
    contact_number VARCHAR(100) NOT NULL DEFAULT '',
    status         INT          NOT NULL DEFAULT 0, -- status: 0:pending  1:replied  2:closed
    body           TEXT         NOT NULL DEFAULT '',
    kind           INT          NOT NULL DEFAULT 0, -- 0 -> feedback / 1 -> contact
    rating         INT          NOT NULL DEFAULT 0,
    reseller_id    INT          NOT NULL DEFAULT 0,

    is_archive     BOOLEAN               DEFAULT FALSE,

    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    archived_at    TIMESTAMP
);

-- Create Update Trigger
CREATE TRIGGER set_timestamp
    BEFORE UPDATE
    ON "feedbacks"
    FOR EACH ROW
EXECUTE PROCEDURE trg_timestamp();