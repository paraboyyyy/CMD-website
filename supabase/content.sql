-- CMD website: research themes, people and alumni, editable by admins at /admin.
-- Run once, after schema.sql: SQL Editor → New query → paste this file → Run.
-- Everyone can read these tables; only admins can add, change or delete rows.

-- ── Research themes ──────────────────────────────────────────────────
create table public.research_themes (
  -- Used in links (/research#id, /publications?theme=id) and in publications.ts, so it never changes.
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 200),
  summary text not null default '',
  body text[] not null default '{}',
  questions text[] not null default '{}',
  methods text[] not null default '{}',
  elements text[] not null default '{}',
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- ── People ───────────────────────────────────────────────────────────
create type public.people_group as enum ('lead', 'postdoc', 'phd', 'master', 'undergrad');

create table public.people (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 200),
  role text not null default '',
  member_group public.people_group not null default 'phd',
  focus text not null default '',
  email text,
  bio text,
  photo_path text,
  links jsonb not null default '[]',
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.alumni (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 200),
  then_text text not null default '', -- e.g. "PhD, 2025"
  now_text text not null default '',  -- e.g. "Postdoc in Japan"
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- ── Access rules ─────────────────────────────────────────────────────
create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['research_themes', 'people', 'alumni'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create trigger touch_updated_at before update on public.%I for each row execute function public.touch_updated_at()', t);
    execute format('create policy "Anyone can read" on public.%I for select to anon, authenticated using (true)', t);
    execute format('create policy "Admins can add" on public.%I for insert to authenticated with check ((select public.is_admin()))', t);
    execute format('create policy "Admins can edit" on public.%I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format('create policy "Admins can delete" on public.%I for delete to authenticated using ((select public.is_admin()))', t);
  end loop;
end;
$$;

-- ── Photos ───────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('people-photos', 'people-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

create policy "Admins can list people photos"
  on storage.objects for select to authenticated
  using (bucket_id = 'people-photos' and (select public.is_admin()));

create policy "Admins can upload people photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'people-photos' and (select public.is_admin()));

create policy "Admins can delete people photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'people-photos' and (select public.is_admin()));

-- ── Starting content: what the website showed before ────────────────
insert into public.research_themes (id, title, summary, body, questions, methods, elements, sort_order) values
  ('spin-orbit', 'Spin–orbit physics in low-dimensional materials',
   'Rashba splitting, persistent spin textures and spin-split states in monolayers, Janus layers and their defects.',
   array['In two-dimensional materials with broken inversion symmetry, spin–orbit coupling locks an electron''s spin to its momentum. We study how this shows up as Rashba and Zeeman-type splitting, and when it produces a persistent spin texture: a uniform spin orientation that protects spin against dephasing and is attractive for spintronic devices.', 'Our calculations cover transition metal dichalcogenides, group-IV monochalcogenides, ferroelectric GaXY compounds and Janus layers whose two faces are different elements. We also look at what strain, electric fields, doping, surface alloying and vacancy line defects do to the spin-split bands.'],
   array['Which 2D compounds host a persistent spin helix with large spin splitting?', 'How do strain, electric fields and dopants tune the size and direction of spin splitting?', 'What spin-polarised states do point and line defects create inside the band gap?'],
   array['DFT with spin–orbit coupling', 'Spin-texture analysis', 'k·p effective models', 'Symmetry analysis'],
   array['Mo', 'W', 'S', 'Se', 'Te', 'Pt', 'Sn', 'Ge', 'Ga', 'Cl', 'Br', 'I', 'Si', 'Sb', 'Bi', 'V', 'Zn', 'O'], 1),
  ('topo-magnetic', 'Topological and magnetic quantum materials',
   'Quantum anomalous Hall phases, valley splitting and magnetism, from first principles and muon spin relaxation.',
   array['When magnetism meets spin–orbit coupling, bands can carry a non-zero Chern number and the material can conduct along its edges without dissipation. We compute Berry curvature and Chern numbers to find 2D materials with a quantum anomalous Hall effect, and look for ways to tune both the Chern number and the band gap.', 'We also study valley splitting from magnetic proximity at heterointerfaces, anomalous Hall effects in layered antiferromagnets, and weak magnetism in correlated oxides, where we develop analysis methods for muon spin relaxation data.'],
   array['Can the Chern number and band gap of a 2D magnet be tuned independently?', 'How large a valley splitting does a magnetic substrate induce?', 'What do muon spin relaxation measurements reveal about weak internal fields in cuprates?'],
   array['Berry curvature and Chern numbers', 'Anomalous Hall conductivity', 'DFT+U', 'Muon spin relaxation analysis'],
   array['La', 'N', 'Te', 'W', 'S', 'Co', 'O', 'Sr', 'Cu', 'Bi', 'Se'], 2),
  ('functional', 'Functional materials, sensors and surfaces',
   'DFT that explains experiments: gas and bio-sensors, graphene-based membranes, catalysts and CO₂ capture.',
   array['Many of our projects pair calculations with laboratory work by partners. We compute how molecules adsorb on nanofibers, oxides and graphene oxide to explain the response of quartz-crystal gas sensors, fluorescent probes and magnetoresistance biosensors.', 'The same tools let us study pore structure and functional groups in nanoporous graphene for CO₂ capture, graphene-oxide membranes for water treatment, doping in silicon carbide and graphene, and catalysts for fuel desulfurization.'],
   array['Which surface groups give the strongest and most selective gas adsorption?', 'How do pore size and edge chemistry control CO₂ uptake in nanoporous graphene?', 'What sets the stability of dopants in SiC and graphene?'],
   array['Adsorption energetics', 'Charge-transfer analysis', 'Defect formation energies', 'Molecular dynamics'],
   array['C', 'O', 'N', 'H', 'Si', 'Sn', 'Fe', 'Zn', 'Ag', 'Mo', 'Cd', 'Te'], 3),
  ('ml-energy', 'Machine learning and energy materials',
   'Data-driven prediction of perovskite properties, and simulations of solar cells, thermoelectrics and fuel-cell electrodes.',
   array['We train machine-learning models on large materials datasets to predict band gaps and other properties of single and double perovskites, and to choose device configurations that improve the stability and efficiency of perovskite solar cells.', 'Alongside this we study energy materials directly: lead-free CsSnI₃ photovoltaics, thermoelectric graphene with dopants and metal deposition, and PtAg-based electrodes for proton-exchange membrane fuel cells.'],
   array['How well can ensemble learning predict whether a perovskite has a direct band gap?', 'Which device layers matter most for perovskite solar cell efficiency?', 'How do dopants change the thermoelectric performance of graphene?'],
   array['Ensemble learning', 'Feature selection', 'Device simulation', 'Transport calculations'],
   array['Cs', 'Sn', 'Pb', 'I', 'Br', 'Cl', 'Pt', 'Ag', 'Au', 'N', 'C'], 4);

-- Only the group lead: the other names on the old page were placeholders.
insert into public.people (name, role, member_group, focus, links, sort_order) values
  ('Moh. Adhib Ulil Absor, S.Si., M.Sc., Ph.D.', 'Supervisor / Lead', 'lead',
   'Spintronics and strongly correlated electron systems; electronic and magnetic properties of condensed matter',
   '[{"label":"Google Scholar","href":"https://scholar.google.co.id/citations?user=LA_l66EAAAAJ&hl=id"},{"label":"UGM profile","href":"https://acadstaff.ugm.ac.id/Adhib"}]'::jsonb, 1);
