--==============================================
--
--  ##     ##   #####   ######  #####   ####
--  ####   ##  ##   ##    ##    ##     ##
--  ##  ## ##  ##   ##    ##    #####   ###
--  ##    ###  ##   ##    ##    ##        ##
--  ##     ##   #####     ##    #####  ####
--
--==============================================


CREATE TABLE IF NOT EXISTS notes
(
    id             SERIAL PRIMARY KEY,
    portal_user_id INT         NOT NULL DEFAULT 0,
    entity_id      INT         NOT NULL DEFAULT 0, -- find note by entity_id for example call_request with id 15 should query as { entity_id: 15, entity_type: 1 }
    entity_type    INT         NOT NULL DEFAULT 0, -- 0: enquiries  1:call_requests  2:feedbacks
    body           TEXT        NOT NULL DEFAULT '',

    is_archive     BOOLEAN              DEFAULT FALSE,

    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    archived_at    TIMESTAMP

);

-- Create Update Trigger
CREATE TRIGGER set_timestamp
    BEFORE UPDATE
    ON "notes"
    FOR EACH ROW
EXECUTE PROCEDURE trg_timestamp();