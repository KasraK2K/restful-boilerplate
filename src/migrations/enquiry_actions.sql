--================================================================================================================================
--
--  #####  ##     ##   #####   ##   ##  ##  #####    ##    ##              ###     ####  ######  ##   #####   ##     ##   ####
--  ##     ####   ##  ##   ##  ##   ##  ##  ##  ##    ##  ##              ## ##   ##       ##    ##  ##   ##  ####   ##  ##
--  #####  ##  ## ##  ##   ##  ##   ##  ##  #####      ####              ##   ##  ##       ##    ##  ##   ##  ##  ## ##   ###
--  ##     ##    ###   #####   ##   ##  ##  ##  ##      ##               #######  ##       ##    ##  ##   ##  ##    ###     ##
--  #####  ##     ##  ##        #####   ##  ##   ##     ##     ########  ##   ##   ####    ##    ##   #####   ##     ##  ####
--
--================================================================================================================================


CREATE TABLE IF NOT EXISTS enquiry_actions
(
    id             SERIAL PRIMARY KEY,
    portal_user_id INT         NOT NULL DEFAULT 0,
    entity_id      INT         NOT NULL DEFAULT 0,
    body           TEXT        NOT NULL DEFAULT '',

    is_archive     BOOLEAN              DEFAULT FALSE,

    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    archived_at    TIMESTAMP
);

-- Create Update Trigger
CREATE TRIGGER set_timestamp
    BEFORE UPDATE
    ON "enquiry_actions"
    FOR EACH ROW
EXECUTE PROCEDURE trg_timestamp();