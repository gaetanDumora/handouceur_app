-- Insert permissions
BEGIN;

INSERT INTO
    permissions (permission_name)
VALUES
    ('all'),
    ('read'),
    ('write'),
    ('delete');

-- Insert roles
INSERT INTO
    roles (role_name)
VALUES
    ('admin'),
    ('user'),
    ('archived user');

-- Create a user
INSERT INTO
    users (
        username,
        email_address,
        hashed_password,
        salt
    )
VALUES
    (
        'superUser',
        'g@bla.com',
        'hashed password',
        'the salt'
    );

-- With full admin privileges
INSERT INTO
    user_roles_permissions (user_id, role_id, permission_id)
VALUES
    (
        1,
        (
            SELECT
                role_id
            FROM
                roles
            WHERE
                role_name = 'admin'
        ),
        (
            SELECT
                permission_id
            FROM
                permissions
            WHERE
                permission_name = 'all'
        )
    );

END;