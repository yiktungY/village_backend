const knex = require("knex")(require("../knexfile.js").development);

const getAllPost = (req, res) => {
  knex
    .select(
      "posts.id as post_id",
      "posts.title",
      "posts.updatedAt",
      "posts.jobImageUrl",
      "posts.status",
      "posts.salary",
      "posts.type",
      "posts.requireDate",
      "salaryReplacement",
      "users.id as user_id",
      "users.avatarUrl",
      "users.displayName"
    )
    .from("posts")
    .leftJoin("users", "posts.user_id", "users.id")
    .orderBy("posts.updatedAt", "desc")
    .then((posts) => {
      let updatedPosts = posts;
      console.log(updatedPosts)
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
  const { userId, jobImageUrl, title, content, status, type, requireDate, salary, salaryReplacement, estimateHour, location } = req.body;
  if (userId === undefined)
    return res.status(401).json({ message: "Unauthorized" });
  if (!req.body.title || !req.body.content) {
    return res
      .status(400)
      .json({ message: "Missing post tilte or content fields" });
  }
  knex("posts")
    .insert({
      user_id: userId,
      jobImageUrl: jobImageUrl,
      title: title,
      content: content,
      status: status,
      type: type,
      requireDate: requireDate,
      salary: salary,
      location: location,
      salaryReplacement: salaryReplacement,
      estimateHour: estimateHour,
    })
    .then((postId) => {
      res.status(201).json({ newPostId: postId[0] });
    })
    .catch(() => {
      res.status(500).json({ message: "Error creating a new post" });
    });
};

const getPostById = async (req, res) => {
  try {
    const typeId = req.params.postID;
    // await knex("posts").where({ id: typeId }).update(viewed++);
    const post = await knex("posts")
      .join("users", "posts.user_id", "=", "users.id")
      .select(
        "posts.id as post_id",
        "users.id as user_id",
        "users.displayname",
        "users.avatarUrl",
        "posts.title",
        "posts.content",
        "posts.location",
        "posts.jobImageUrl",
        "posts.status",
        "posts.type",
        "posts.salary",
        "posts.requireDate",
        "posts.salaryReplacement",
        "posts.estimateHour",
        "posts.updatedAt"
      ).where("posts.id", typeId)
    if (post) {
      res.status(200).json(post.shift())
    }
  }
  catch (error) {
    res.status(500).json({ message: `${error}: Error fetching posts` });
  };
};

const editPost = async (req, res) => {
  const typeId = req.params.postID;
  const changes = req.body;
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
      "posts.updatedAt",
      "posts.status",
      "posts.jobImageUrl",
      "posts.salary",
      "posts.type",
      "posts.requireDate",
      "salaryReplacement",
      "users.id as user_id",
      "users.avatarUrl",
      "users.displayName"
    )
    .from("posts")
    .where("posts.type", category)
    .leftJoin("users", "posts.user_id", "users.id")
    .orderBy("posts.updatedAt", "desc")
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
