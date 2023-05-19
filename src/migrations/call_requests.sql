-- =============================================================================================================
--
--    ####    ###    ##      ##                #####    #####   #####   ##   ##  #####   ####  ######   ####
--  ##      ## ##   ##      ##                ##  ##   ##     ##   ##  ##   ##  ##     ##       ##    ##
--  ##     ##   ##  ##      ##                #####    #####  ##   ##  ##   ##  #####   ###     ##     ###
--  ##     #######  ##      ##                ##  ##   ##      #####   ##   ##  ##        ##    ##       ##
--   ####  ##   ##  ######  ######  ########  ##   ##  #####  ##        #####   #####  ####     ##    ####
--
--=============================================================================================================


CREATE TABLE IF NOT EXISTS call_requests
(
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL DEFAULT '',
    email            VARCHAR(100) NOT NULL DEFAULT '',
    contact_number   VARCHAR(100) NOT NULL DEFAULT '',
    status           INT          NOT NULL DEFAULT 0,  -- enum (pending, scheduled)
    schedule_request VARCHAR(50)  NOT NULL DEFAULT '',
    schedule         VARCHAR(50)  NOT NULL DEFAULT '', -- empty -> schedule / not empty -> reschedule
    topic            VARCHAR(50)  NOT NULL DEFAULT '',
    reseller_id      INT          NOT NULL DEFAULT 0,

    is_archive       BOOLEAN               DEFAULT FALSE,

    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    archived_at      TIMESTAMP
);

-- Create Update Trigger
CREATE TRIGGER set_timestamp
    BEFORE UPDATE
    ON "call_requests"
    FOR EACH ROW
EXECUTE PROCEDURE trg_timestamp();