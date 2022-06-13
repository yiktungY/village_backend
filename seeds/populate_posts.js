// A library for generating mock data
const casual = require("casual");

exports.seed = function (knex) {
  // First, delete all posts from the table

  return knex("applyList")
    .del()
    .then(() => {
      return knex("posts")
        .del()
        .then(() => {
          // Next delete a mock user
          return knex("users").del();
        })
    })

    .then(() => {
      const users = [
        {
          password: "123",
          id: "111",
          givenName: "Yik Tung",
          familyName: "Yeung",
          address: "Toronto",
          introduction: "Hey, I am a full-stack web developer.",
          age: "26",
          avatar_url:
            "https://firebasestorage.googleapis.com/v0/b/village-345022.appspot.com/o/files%2FShareImage.jpg?alt=media&token=7a28bd04-3f92-4006-a524-03c2e2094ca5",
          displayName: "Yik",
          email: "yiktungtony@gmail.com",
        },
        {
          password: "123",
          id: "222",
          givenName: "Jennifer",
          familyName: "Brook",
          address: "Toronto",
          introduction: "Hey, I am a student looking for connecting.",
          age: "22",
          avatar_url:
            "https://firebasestorage.googleapis.com/v0/b/village-345022.appspot.com/o/files%2FJennifer%20William.jpeg?alt=media&token=b83870c3-52cb-4343-ab58-938a289d41ee",
          displayName: "Jennifer",
          email: "123test@gmail.com",
        },
      ];
      // Then create a mock user (so we have more than one account for testing posts)
      return knex("users").insert(users);
    })
    .then(() => {
      // Get all user ids from users table
      return knex("users").select("id");
    })
    .then((userIds) => {
      const randomIndex = Math.floor(Math.random() * userIds.length);
      const randomId = userIds[randomIndex].id;
      const mockPosts = [
        {
          id: "123",
          user_id: randomId,
          title: "dog walking",
          content: casual.sentence,
          picture_Details:
            "https://firebasestorage.googleapis.com/v0/b/village-345022.appspot.com/o/files%2F124465293-56a001375f9b58eba4ae696f.jpeg?alt=media&token=9070e549-4adb-4356-a141-41119dbdfaa9",
          type: "dog walking",
          requireDate: "30/06/2022",
          salary: "",
          salary_replacement: "beer on me",
          estimate_time: "half an hour",
          status: "open",
        },
        {
          id: "1234",
          user_id: randomId,
          title: "Gardening",
          content: casual.sentence,
          picture_Details:
            "https://firebasestorage.googleapis.com/v0/b/village-345022.appspot.com/o/files%2FB.jpeg?alt=media&token=ae5a45fe-f0fc-4a2f-a842-2038721d1fa7",
          type: "Gardening",
          requireDate: "10/06/2022",
          salary: "20/hour",
          salary_replacement: "",
          estimate_time: "3 hours",
          status: "open",
        },
        {
          id: "1235",
          user_id: randomId,
          title: casual.title,
          content: casual.sentence,
          picture_Details:
            "https://firebasestorage.googleapis.com/v0/b/village-345022.appspot.com/o/files%2FC.webp?alt=media&token=eb8b967d-45b7-4548-8efb-e6fb533ea1d4",
          type: "Design",
          requireDate: "28/05/2022",
          salary: "30/hour",
          salary_replacement: "",
          estimate_time: "3 hours",
          status: "open",
        },
        {
          id: "1236",
          user_id: randomId,
          title: casual.title,
          content: casual.sentence,
          picture_Details:
            "https://firebasestorage.googleapis.com/v0/b/village-345022.appspot.com/o/files%2FD.jpeg?alt=media&token=ee90190d-a099-4c2e-b0e9-f62138b2d92d",
          type: "Accounting",
          requireDate: "28/07/2022",
          salary: "20/hours",
          salary_replacement: "",
          estimate_time: "1 hour",
          status: "open",
        },
        {
          id: "127",
          user_id: randomId,
          title: casual.title,
          content: casual.sentence,
          picture_Details:
            "https://firebasestorage.googleapis.com/v0/b/village-345022.appspot.com/o/files%2FE.jpeg?alt=media&token=c2c7b109-6839-425f-b0ad-368ad8aea9f6",
          type: "Cook",
          requireDate: "20/07/2022",
          salary: "30/hour",
          salary_replacement: "",
          estimate_time: "2 hours",
          status: "open",
        },
        {
          id: "128",
          user_id: randomId,
          title: casual.title,
          content: casual.sentence,
          picture_Details:
            "https://firebasestorage.googleapis.com/v0/b/village-345022.appspot.com/o/files%2FF.webp?alt=media&token=2f8721fb-74f5-4bdd-90fa-a1b71a17c5dd",
          type: "technician jobs",
          requireDate: "20/09/2022",
          salary: "50/hours",
          salary_replacement: "",
          estimate_time: "3",
          status: "open",
        },
        {
          id: "129",
          user_id: randomId,
          title: casual.title,
          content: casual.sentence,
          picture_Details:
            "https://firebasestorage.googleapis.com/v0/b/village-345022.appspot.com/o/files%2Fcooking.webp?alt=media&token=d94a60bf-1939-4148-a411-2b8812244a69",
          type: "Cook",
          requireDate: "20/07/2022",
          salary: "30/hour",
          salary_replacement: "",
          estimate_time: "2 hours",
          status: "open",
        },
      ];
      return knex("posts").insert(mockPosts);
    });
};