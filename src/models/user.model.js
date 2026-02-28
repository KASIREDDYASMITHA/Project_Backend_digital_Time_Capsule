
// CREATE TABLE public.admins (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   email text NOT NULL UNIQUE,
//   password text NOT NULL,
//   created_at timestamp without time zone DEFAULT now(),
//   CONSTRAINT admins_pkey PRIMARY KEY (id)
// );



// CREATE TABLE public.capsules (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   user_id uuid,
//   title text NOT NULL,
//   description text,
//   content text,
//   unlock_date timestamp with time zone NOT NULL,
//   is_locked boolean DEFAULT true,
//   theme text,
//   share_token uuid,
//   share_expiry timestamp with time zone,
//   created_at timestamp with time zone DEFAULT now(),
//   is_public boolean DEFAULT false,
//   send_email boolean DEFAULT false,
//   milestone text,
//   secret_message text,
//   recipient_email text,
//   media_urls ARRAY,
//   send_email_reminder boolean DEFAULT false,
//   timezone text,
//   country text,
//   state text,
//   CONSTRAINT capsules_pkey PRIMARY KEY (id),
//   CONSTRAINT capsules_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
// );


// CREATE TABLE public.email_logs (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   capsule_id uuid,
//   recipient_email text NOT NULL,
//   subject text,
//   status text CHECK (status = ANY (ARRAY['success'::text, 'failed'::text])),
//   error_message text,
//   sent_at timestamp without time zone DEFAULT now(),
//   CONSTRAINT email_logs_pkey PRIMARY KEY (id),
//   CONSTRAINT email_logs_capsule_id_fkey FOREIGN KEY (capsule_id) REFERENCES public.capsules(id)
// );


// CREATE TABLE public.users (
//   id uuid NOT NULL,
//   name text NOT NULL,
//   email text NOT NULL UNIQUE,
//   password text NOT NULL,
//   created_at timestamp without time zone DEFAULT now(),
//   CONSTRAINT users_pkey PRIMARY KEY (id)
// );