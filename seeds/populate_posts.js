/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const casual = require("casual");
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("applyList").del();

  const mockPosts = [];

  // Generate 10 posts
  for (let i = 0; i < 10; i++) {
    // Select a user id randomly from the list of users to create a post for

    // Use user id from users table for user_id and `casual` library to generate mock title and content fields
    mockPosts.push({
      user_id: "05f134da-b614-11ec-af3d-52146bdd15d0",
      title: casual.title,
      content: casual.sentences(10),
      type: "Accounting",
      status: "open",
    });
  }
  // Insert mock posts into the table

  await knex("posts").del().insert(mockPosts);
  await knex("users").insert({
    google_id: "05f134da-b614-11ec-af3d-52146bdd15d0",
    avatar_url: "https://avatars.githubusercontent.com/u/92953487?v=4",
    displayName: "dummy-user",
    email: "123example@gmail.com",
  });
};

// // A library for generating mock data

// exports.seed = function (knex) {
//   return knex("applyList")
//     .del()
//     .then(() => {
//       // First, delete all posts from the table
//       return knex("posts");
//     })
//     .del()
//     .then(() => {
//       // Next delete a mock user
//       return knex("users").del();
//     })
//     .then(() => {
//       // Then create a mock user (so we have more than one account for testing posts)
//       return knex("users").insert({
//         google_id: 929534874242,
//         avatar_url: "https://avatars.githubusercontent.com/u/92953487?v=4",
//         displayName: "dummy-user",
//         email: "123example@gmail.com",
//       });
//     })
//     .then(() => {
//       // Get all user ids from users table
//       return knex("users").select("id");
//     })
//     .then((userIds) => {
//       const mockPosts = [];

//       // Generate 10 posts
//       for (let i = 0; i < 10; i++) {
//         // Select a user id randomly from the list of users to create a post for
//         const randomIndex = Math.floor(Math.random() * userIds.length);
//         const randomId = userIds[randomIndex].id;

//         // Use user id from users table for user_id and `casual` library to generate mock title and content fields
//         mockPosts.push({
//           user_id: randomId,
//           title: casual.title,
//           content: casual.sentences(10),
//           type: "Accounting",
//           status: "open",
//         });
//       }
//       // Insert mock posts into the table
//       return knex("posts").insert(mockPosts);
//     });
// };
