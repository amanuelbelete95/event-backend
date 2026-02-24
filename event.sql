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
  userName VARCHAR(200) unique not null,
  password VARCHAR(250),
  role VARCHAR(200)
);

create table event_order (
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