CREATE TABLE IF NOT EXISTS public.users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    username VARCHAR(20) UNIQUE NOT NULL,
    avatar_url VARCHAR(255),
    email_address VARCHAR(50) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) UNIQUE NOT NULL,
    salt VARCHAR(255) NOT NULL,
    address VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_roles_permissions (
    user_id INTEGER REFERENCES public.users (user_id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES public.roles (role_id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES public.permissions (permission_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.travels (
    travel_id SERIAL PRIMARY KEY,
    title VARCHAR(20) UNIQUE,
    subtitle VARCHAR(20),
    location VARCHAR(20),
    coordinates FLOAT [],
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    price NUMERIC(10, 2),
    autonomy VARCHAR(10),
    image_urls TEXT [],
    main_text TEXT,
    activity_text TEXT,
    hosting_text TEXT,
    transport_text TEXT,
    max_booking INTEGER,
    support_staff INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.bookings(
    user_id INTEGER NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    travel_id INTEGER NOT NULL REFERENCES public.travels(travel_id) ON DELETE CASCADE,
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, travel_id)
);

CREATE ROLE "vault" WITH SUPERUSER LOGIN ENCRYPTED PASSWORD 'vault';