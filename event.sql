create database events;

create table event (
  id serial primary key,
  name VARCHAR(200),
  date date,
  status VARCHAR(200),
  description TEXT
);

create table users (
  id serial primary key,
  username VARCHAR(200) unique not null,
  password VARCHAR(250),
  role VARCHAR(200)
);

create table event_registration (
  id bigserial primary key,
  event_id integer not null
    references event(id)
    on delete cascade,
    
  user_id integer not null
    references users(id)
    on delete cascade,

  join_date timestamp default now(),

  reason text not null,

  unique (event_id, user_id)
);


-- Alter the table to register the status of the event

ALTER TABLE event
ADD COLUMN registration_status BOOLEAN DEFAULT FALSE;

-- add registration count to the event table
ALTER TABLE event
ADD COLUMN registration_count INTEGER DEFAULT 0;