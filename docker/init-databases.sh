#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE nutri_idm;
    CREATE DATABASE nutri_menu;
    CREATE DATABASE nutri_workout;
    CREATE DATABASE nutri_tracking;
    CREATE DATABASE nutri_conversation;
EOSQL
