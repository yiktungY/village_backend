const knex = require("knex")(require("../knexfile.js").production);

const applyToPost = (req, res) => {
  const { userId, username, post_id, post_title, content, offer } = req.body
  if (userId === undefined)
    return res.status(401).json({ message: "Unauthorized" });
  if (!post_title || !content) {
    return res
      .status(400)
      .json({ message: "Missing post tilte or content fields" });
  }
  knex("applyList")
    .insert({
      user_id: userId,
      username: username,
      post_id: post_id,
      post_title: post_title,
      content: content,
      offer: offer,
    })
    .then((data) => {
      res.status(201).json({ newUser: data[0] });
    })
    .catch(() => {
      res.status(500).json({ message: "Error creating a new post" });
    });
};

const getApplicantsById = (req, res) => {
  const postId = req.params.postID;
  knex("applyList")
    .where("post_id", postId)
    .orderBy("updated_at", "desc")
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(500).json({ message: "Error fetching posts" });
    });
};

module.exports = {
  applyToPost,
  getApplicantsById,
};
