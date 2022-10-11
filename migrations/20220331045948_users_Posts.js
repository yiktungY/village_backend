exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
      table.string("password").notNullable();
      table.string("avatarUrl").notNullable();
      table.string("displayName").notNullable();
      table.string("email").notNullable();
      table.string("givenName");
      table.string("familyName");
      table.string("address");
      table.string("introduction");
      table.string("tags");
      table.integer("age");
      table.integer("rating");
      table.boolean("finishedBoarding").defaultTo(false)
      table.integer("doneCase").defaultTo(0);
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
    })
    .createTable("posts", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
      table.string("jobImageUrl");
      table.string("title", 75).notNullable();
      table.text("content").notNullable();
      table.string("type").notNullable();
      table.string("requireDate");
      table.string("salary");
      table.string("salaryReplacement");
      table.string("estimateHour");
      table.integer("viewed").defaultTo(0);
      table.string("location");
      table.string("status").notNullable();
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
      table.uuid('user_id').notNullable();
      table.foreign("user_id").references("id").inTable("users");
    })
    .createTable("applyList", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
      table.string("content").notNullable();
      table.string("offer");
      table.boolean("acceptByApplicant").defaultTo(false);
      table.boolean("acceptByRespondent").defaultTo(false);
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
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
