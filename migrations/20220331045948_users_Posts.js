exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
      table.string("password").notNullable();
      table.string("avatar_url").notNullable();
      table.string("displayName").notNullable();
      table.string("email").notNullable();
      table.string("givenName");
      table.string("familyName");
      table.string("address");
      table.string("introduction");
      table.string("selftag");
      table.integer("age");
      table.integer("rating");
      table.integer("doneCase").defaultTo(0);
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("posts", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
      table.string("picture_Details");
      table.string("title", 75).notNullable();
      table.text("content").notNullable();
      table.string("type").notNullable();
      table.string("requireDate");
      table.string("salary");
      table.string("salary_replacement");
      table.string("estimate_time");
      table.integer("viewed");
      table.string("status").notNullable();
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.uuid('user_id').notNullable();
      table.foreign("user_id").references("id").inTable("users");
    })
    .createTable("applyList", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
      table.string("avatar_url");
      table.string("content").notNullable();
      table.string("offer");
      table.string("requirment");
      table.string("accept");
      table.string("username").notNullable();
      table.string("post_title").notNullable();
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.uuid('user_id').notNullable();
      table.foreign("user_id").references("id").inTable("users");

      table.uuid('post_id').notNullable();
      table.foreign("post_id").references("id").inTable("posts");
    });
};

exports.down = function (knex) {
  return (
    knex.schema
      .dropTable("applyList")
      .dropTable("posts")
      .dropTable("users")
  );
};
