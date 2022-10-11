const knex = require("knex")(require("../knexfile").development);

const getAllUser = (req, res) => {
  knex("users")
    .then((user) => {
      if (user.length > 0) {
        res.status(200).json(user);
      } else {
        res
          .status(400)
          .json({ message: `Error getting user ${req.params.id}` });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: `Error getting user ${req.params.id}` });
    });
};

const getUserById = (req, res) => {
  const typeId = req.params.id;
  knex("users")
    .where({ id: typeId })
    .then((user) => {
      if (user.length > 0) {
        res.status(200).json(user.shift());
      } else {
        res
          .status(400)
          .json({ message: `Error getting user ${req.params.id}` });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: `Error getting user ${req.params.id}` });
    });
};

const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  console.log("change", changes)
  try {
    const count = await knex("users").where({ id }).update(changes);
    if (count) {
      res.status(200).json({ updated: count });
    } else {
      res.status(404).json({ message: "ID not fond" });
    }
  } catch (err) {
    res.status(500).json({ message: { err } });
  }
};

const getAllPostbyUserId = (req, res) => {
  const userId = req.params.id;
  knex("posts")
    .select(
      "posts.id as post_id",
      "posts.title",
      "posts.content",
      "posts.type",
      "posts.jobImageUrl",
      "posts.updatedAt",
      "posts.status",
      "users.id as user_id",
      "users.displayName",
      "users.avatarUrl"
    )
    .from("posts")
    .leftJoin("users", "posts.user_id", "users.id")
    .orderBy("posts.updatedAt", "desc")
    .where("users.id", userId)
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

module.exports = {
  getUserById,
  getAllUser,
  updateUserProfile,
  getAllPostbyUserId,
};
