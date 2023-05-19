--=========================================================================================================
--
--   ####    ###    ###    ###  #####   ##      #####            ######  #####  ##    ##  ######   ####
--  ##      ## ##   ## #  # ##  ##  ##  ##      ##                 ##    ##      ##  ##     ##    ##
--   ###   ##   ##  ##  ##  ##  #####   ##      #####              ##    #####    ####      ##     ###
--     ##  #######  ##      ##  ##      ##      ##                 ##    ##      ##  ##     ##       ##
--  ####   ##   ##  ##      ##  ##      ######  #####  ########    ##    #####  ##    ##    ##    ####
--
--=========================================================================================================


CREATE TABLE IF NOT EXISTS sample_texts
(
    id             SERIAL PRIMARY KEY,
    text           TEXT        NOT NULL DEFAULT '',
    type           INT         NOT NULL DEFAULT 0, -- 0: feedback_notes
    reseller_id    INT         NOT NULL DEFAULT 0,
    portal_user_id INT         NOT NULL DEFAULT 0,

    is_archive     BOOLEAN              DEFAULT FALSE,

    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    archived_at    TIMESTAMP
);

-- Create Update Trigger
CREATE TRIGGER set_timestamp
    BEFORE UPDATE
    ON "sample_texts"
    FOR EACH ROW
EXECUTE PROCEDURE trg_timestamp();