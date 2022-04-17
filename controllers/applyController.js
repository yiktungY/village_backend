const knex = require("knex")(require("../knexfile.js").development);

const applyToPost = (req, res) => {
  const userId = req.user.displayName;

  if (userId === undefined)
    return res.status(401).json({ message: "Unauthorized" });
  // if (!req.body.title || !req.body.content) {
  //   return res
  //     .status(400)
  //     .json({ message: "Missing post tilte or content fields" });
  // }
  knex("applyList")
    .insert({
      user_id: req.user.id,
      username: req.user.displayName,
      post_id: req.body.post_id,
      post_title: req.body.post_title,
      content: req.body.content,
      offer: req.body.offer,
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
  console.log(postId);
  console.log(knex("applyList.post_id"));
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
