--======================================================================================================
--
--  ##  ##     ##  ##  ######        ####      ###    ######    ###    #####     ###     ####  #####
--  ##  ####   ##  ##    ##          ##  ##   ## ##     ##     ## ##   ##  ##   ## ##   ##     ##
--  ##  ##  ## ##  ##    ##          ##  ##  ##   ##    ##    ##   ##  #####   ##   ##   ###   #####
--  ##  ##    ###  ##    ##          ##  ##  #######    ##    #######  ##  ##  #######     ##  ##
--  ##  ##     ##  ##    ##          ####    ##   ##    ##    ##   ##  #####   ##   ##  ####   #####
--
--======================================================================================================


CREATE DATABASE apppair;

GRANT ALL PRIVILEGES ON DATABASE apppair TO postgres;

-- Extention
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- Start Update Trigger
CREATE OR REPLACE FUNCTION public.trg_timestamp()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS
$BODY$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.trg_timestamp()
    OWNER TO postgres;
-- End Update Trigger