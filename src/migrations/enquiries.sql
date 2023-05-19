--=======================================================================
--
--  #####  ##     ##   #####   ##   ##  ##  #####    ##  #####   ####
--  ##     ####   ##  ##   ##  ##   ##  ##  ##  ##   ##  ##     ##
--  #####  ##  ## ##  ##   ##  ##   ##  ##  #####    ##  #####   ###
--  ##     ##    ###   #####   ##   ##  ##  ##  ##   ##  ##        ##
--  #####  ##     ##  ##        #####   ##  ##   ##  ##  #####  ####
--
--=======================================================================


CREATE TABLE IF NOT EXISTS enquiries
(
    id           SERIAL PRIMARY KEY,
    user_id      INT         NOT NULL DEFAULT 0,
    user_name    VARCHAR(50) NOT NULL DEFAULT '',
    email        VARCHAR(50) NOT NULL DEFAULT '',

    service_type INT         NOT NULL DEFAULT 0,
    status       INT         NOT NULL DEFAULT 0, -- enum (pending, responded, forwarded, ongoing, closed)
    reseller_id  INT         NOT NULL DEFAULT 0,
    enquiry_data JSON        NOT NULL DEFAULT '{}',

    is_archive   BOOLEAN              DEFAULT FALSE,

    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    archived_at  TIMESTAMP
);

-- Create Update Trigger
CREATE TRIGGER set_timestamp
    BEFORE UPDATE
    ON "enquiries"
    FOR EACH ROW
EXECUTE PROCEDURE trg_timestamp();

-- Create Indexes
CREATE INDEX "enquiries_reseller_id" ON "enquiries" ("reseller_id");