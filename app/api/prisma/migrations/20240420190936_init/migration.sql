-- CreateTable
CREATE TABLE "permissions" (
    "permission_id" SERIAL NOT NULL,
    "permission_name" VARCHAR(20) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(20) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "user_roles_permissions" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "user_roles_permissions_pkey" PRIMARY KEY ("user_id","role_id","permission_id")
);

-- CreateTable
CREATE TABLE "travels" (
    "travel_id" SERIAL NOT NULL,
    "title" VARCHAR(20),
    "subtitle" VARCHAR(20),
    "location" VARCHAR(20),
    "coordinates" DOUBLE PRECISION[],
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "price" DECIMAL(10,2),
    "autonomy" VARCHAR(10),
    "image_urls" TEXT[],
    "main_text" TEXT,
    "activity_text" TEXT,
    "hosting_text" TEXT,
    "transport_text" TEXT,
    "max_booking" INTEGER,
    "support_staff" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "travels_pkey" PRIMARY KEY ("travel_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "first_name" VARCHAR(20),
    "last_name" VARCHAR(20),
    "username" VARCHAR(20) NOT NULL,
    "avatar_url" VARCHAR(255),
    "email_address" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "address" VARCHAR(30),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "user_id" INTEGER NOT NULL,
    "travel_id" INTEGER NOT NULL,
    "booked_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("user_id","travel_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_permission_name_key" ON "permissions"("permission_name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "travels_title_key" ON "travels"("title");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_address_key" ON "users"("email_address");

-- CreateIndex
CREATE UNIQUE INDEX "users_password_key" ON "users"("password");

-- AddForeignKey
ALTER TABLE "user_roles_permissions" ADD CONSTRAINT "user_roles_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("permission_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles_permissions" ADD CONSTRAINT "user_roles_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles_permissions" ADD CONSTRAINT "user_roles_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_travel_id_fkey" FOREIGN KEY ("travel_id") REFERENCES "travels"("travel_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
