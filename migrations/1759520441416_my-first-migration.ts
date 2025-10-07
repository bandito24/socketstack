import { MigrationBuilder } from 'node-pg-migrate';

// export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("rooms", {
        id: {type: "serial", primaryKey: true, },
        name: {
            type: "varchar(155)",
            notNull: true,
            unique: true
        },
        slug: {
            type: "varchar(160)",
            notNull: true,
            unique: true
        },
        createdAt: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
        password: "text"
    });

    pgm.createTable("room_users", {
        user_id: {
            type: "text",
            notNull: true,
            references: 'users(id)',
        },
        room_id: {
            type: "int",
            notNull: true,
            references: "rooms(id)",
            onDelete: 'CASCADE'
        },
        joined_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    })
    pgm.addConstraint("room_users", "room_users_pkey", {
        primaryKey: ["user_id", "room_id"],
    });


    pgm.createIndex("rooms", "slug");

}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("room_users");
    pgm.dropTable("rooms");

}
