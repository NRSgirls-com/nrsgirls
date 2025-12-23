Database

High level schema notes:
- users (id, role, email, hashed_password, created_at)
- djs (user_id, display_name, bio, metadata)
- performers (user_id, profile_name, privacy_settings, contact)
- mixes (id, dj_id, title, duration, file_path, rights_metadata)
- plays (mix_id, user_id, timestamp)

Migrations and schema SQL to be added in future tasks.