create extension if not exists vector;

create table if not exists hs_codes (
  id bigserial primary key,
  hs_code varchar(8) not null,
  description text not null,
  embedding vector(768)
);

-- Enable RLS
alter table hs_codes enable row level security;

-- Public read access since these are standard HS codes
create policy "Allow public read access to hs_codes" 
  on hs_codes 
  for select 
  to authenticated, anon 
  using (true);

-- Function for similarity search
create or replace function match_hs_codes (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  hs_code varchar(8),
  description text,
  similarity float
)
language sql
as $$
  select
    hs_codes.id,
    hs_codes.hs_code,
    hs_codes.description,
    1 - (hs_codes.embedding <=> query_embedding) as similarity
  from hs_codes
  where 1 - (hs_codes.embedding <=> query_embedding) > match_threshold
  order by hs_codes.embedding <=> query_embedding
  limit match_count;
$$;
