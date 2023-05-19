--============================================================================
--
--   ####   #####   ##      ##   ##  ######  ##   #####   ##     ##   ####
--  ##     ##   ##  ##      ##   ##    ##    ##  ##   ##  ####   ##  ##
--   ###   ##   ##  ##      ##   ##    ##    ##  ##   ##  ##  ## ##   ###
--     ##  ##   ##  ##      ##   ##    ##    ##  ##   ##  ##    ###     ##
--  ####    #####   ######   #####     ##    ##   #####   ##     ##  ####
--
--============================================================================


CREATE TABLE IF NOT EXISTS solutions
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL DEFAULT '',
    category    INT          NOT NULL DEFAULT 0,
    description TEXT         NOT NULL DEFAULT '',
    links       json         NOT NULL DEFAULT '{}',
    status      INT          NOT NULL DEFAULT 0, -- 0: Active 1: Pending, 2: Rejected, 3: Inactive

    is_private  BOOLEAN               DEFAULT FALSE,
    is_archive  BOOLEAN               DEFAULT FALSE,

    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    archived_at TIMESTAMP
);

-- Create Update Trigger
CREATE TRIGGER set_timestamp
    BEFORE UPDATE
    ON "solutions"
    FOR EACH ROW
EXECUTE PROCEDURE trg_timestamp();