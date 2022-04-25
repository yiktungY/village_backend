const knex = require("knex")(require("../knexfile.js").development);

const getAllPost = (req, res) => {
  // console.log("req", req);
  knex
    .select(
      "posts.id as post_id",
      "posts.title",
      "posts.updated_at",
      "posts.picture_Details",
      "posts.status",
      "posts.salary",
      "posts.type",
      "posts.requireDate",
      "salary_replacement",
      "users.id as user_id",
      "users.avatar_url",
      "users.displayName"
    )
    .from("posts")
    .leftJoin("users", "posts.user_id", "users.id")
    .orderBy("posts.updated_at", "desc")
    .then((posts) => {
      let updatedPosts = posts;
      if (req.user) {
        updatedPosts = updatedPosts.map((post) => {
          return {
            ...post,
            isCurrentUser: post.user_id === req.user.id,
          };
        });
      }
      res.status(200).json(posts);
    })
    .catch(() => {
      res.status(500).json({ message: "Error fetching posts" });
    });
};

const createNewPost = (req, res) => {
  const userId = req.user;
  if (userId === undefined)
    return res.status(401).json({ message: "Unauthorized" });
  if (!req.body.title || !req.body.content) {
    return res
      .status(400)
      .json({ message: "Missing post tilte or content fields" });
  }
  knex("posts")
    .insert({
      user_id: req.user.id,
      picture_Details: req.body.picture_Details,
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
      type: req.body.type,
      requireDate: req.body.requireDate,
      salary: req.body.salary,
      salary_replacement: req.body.salary_replacement,
      estimate_time: req.body.estimate_time,
    })
    .then((postId) => {
      console.log(postId, "postId");
      res.status(201).json({ newPostId: postId[0] });
    })
    .catch(() => {
      res.status(500).json({ message: "Error creating a new post" });
    });
};

const getPostById = (req, res) => {
  const typeId = req.params.postID;
  knex("posts")
    .join("users", "posts.user_id", "=", "users.id")
    .select(
      "posts.id as post_id",
      "users.id as user_id",
      "users.displayname",
      "users.avatar_url",
      "posts.title",
      "posts.content",
      "posts.picture_Details",
      "posts.status",
      "posts.type",
      "posts.salary",
      "posts.requireDate",
      "posts.salary_replacement",
      "posts.estimate_time",
      "posts.updated_at"
    )
    .where("posts.id", typeId)
    .then((data) => {
      res.json(data.shift());
    })
    .catch(() => {
      res.status(500).json({ message: "Error fetching posts" });
    });
};

const editPost = async (req, res) => {
  const typeId = req.params.postID;
  const changes = req.body;
  // console.log(typeId);
  try {
    const count = await knex("posts").where({ id: typeId }).update(changes);
    if (count) {
      res.status(200).json({ updated: count });
    } else {
      res.status(404).json({ message: "ID not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: { err } });
    // .json({ message: "Error updating new post" }, { error: err });
  }
};

const deletePost = async (req, res) => {
  const typeId = req.params.postID;
  try {
    const count = await knex("posts").where({ id: typeId }).del();
    if (count) {
      res.status(200).json({ updated: count });
    } else {
      res.status(404).json({ message: "ID not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: { err } });
  }
};

const getPostbyGenre = (req, res) => {
  const category = req.params.categoryName;
  knex
    .select(
      "posts.id as post_id",
      "posts.title",
      "posts.updated_at",
      "posts.status",
      "posts.picture_Details",
      "posts.salary",
      "posts.type",
      "posts.requireDate",
      "salary_replacement",
      "users.id as user_id",
      "users.avatar_url",
      "users.displayName"
    )
    .from("posts")
    .where("posts.type", category)
    .leftJoin("users", "posts.user_id", "users.id")
    .orderBy("posts.updated_at", "desc")
    .then((posts) => {
      let updatedPosts = posts;
      if (req.user) {
        updatedPosts = updatedPosts.map((post) => {
          return {
            ...post,
            isCurrentUser: post.user_id === req.user.id,
          };
        });
      }
      res.status(200).json(posts);
    })
    .catch(() => {
      res.status(500).json({ message: "Error fetching posts" });
    });
};

// const applyJob = (req, res) => {
//   const typeId = req.params.postID;
//   knex("posts")
//     .join("users", "posts.user_id", "=", "users.id")
//     .select("posts.id", "users.id",)
//     .where("posts.id", typeId)
//     .then((data) => {
//       res.json(data);
//     })
//     .catch(() => {
//       res.status(500).json({ message: "Error fetching posts" });
//     });
// };

module.exports = {
  getAllPost,
  createNewPost,
  editPost,
  getPostById,
  deletePost,
  getPostbyGenre,
};
