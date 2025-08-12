-- Add Expo push token column to profiles
alter table if exists public.profiles
  add column if not exists expo_push_token text;

-- Function to invoke push_notify edge function after inserting a pulse
create or replace function public.notify_pulse()
returns trigger as $$
begin
  perform
    net.http_post(
      url := current_setting('functions.push_notify.url', true),
      headers := '{"Content-Type": "application/json"}',
      body := json_build_object('record', row_to_json(NEW))
    );
  return NEW;
end;
$$ language plpgsql security definer;

drop trigger if exists notify_pulse_trigger on public.pulses;
create trigger notify_pulse_trigger
  after insert on public.pulses
  for each row execute function public.notify_pulse();
