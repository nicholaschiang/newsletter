create or replace function setup()
returns void as
$$
  create domain url as text check (value ~ '^https?:\/\/\S+$');
  create domain phone as text check (value ~ '^(\+\d{1,3})\d{10}$');
  create domain email as text check (value ~ '^[A-Za-z0-9._~+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');
  create table users (
    "id" bigint unique not null primary key,
    "name" text not null check(length(name) > 1 AND name !~ '^\s+$'),
    "photo" url unique,
    "email" email unique,
    "phone" phone unique,
    "locale" text not null,
    "token" text not null,
    "scopes" text[] not null,
    "label" text not null,
    "filter" text not null
  );
  create type category as enum('important', 'other');
  create table newsletters (
    "name" text not null check(length(name) > 1 AND name !~ '^\s+$'),
    "photo" url unique,
    "email" email unique not null primary key, 
    "category" category,
    "favorite" boolean not null default false
  );
  create table subscriptions (
    "newsletter" text references newsletters(email) on delete cascade on update cascade not null,
    "user" bigint references users(id) on delete cascade on update cascade not null,
    primary key ("newsletter", "user")
  );
  create table messages (
    "newsletter" text references newsletters(email) on delete cascade on update cascade not null,
    "id" text unique not null primary key,
    "date" timestamptz not null,
    "subject" text not null,
    "snippet" text not null,
    "raw" text not null,
    "html" text not null,
    "archived" boolean not null default false,
    "scroll" bigint not null default 0,
    "time" bigint not null default 0
  );
  create table highlights (
    "message" text references messages(id) on delete cascade on update cascade not null,
    "id" bigint generated always as identity primary key,
    "start" text not null,
    "startOffset" bigint not null,
    "end" text not null,
    "endOffset" bigint not null,
    "text" text not null,
    "deleted" boolean not null default false
  );
$$
language sql volatile;