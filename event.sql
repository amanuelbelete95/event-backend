create database events;

create table event (
  id serial primary key,
  name VARCHAR(200),
  date date,
  status VARCHAR(200),
  description TEXT
);

alter table event
add column location VARCHAR(200);

insert into
  event (
    name,
    event_date,
    event_status,
    description,
    location
  )
values
  ();

select
  *
from
  event;

  gg_


create table users (
  id serial primary key,
  userName VARCHAR(200) unique not null,
  password VARCHAR(250),
  role VARCHAR(200)
);

create table event_order (
  id bigserial not null primary key,
  event_id
)