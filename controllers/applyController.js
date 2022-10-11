const knex = require("knex")(require("../knexfile.js").development);

const applyToPost = async (req, res) => {
  try {
    const { userId, postId, content, offer } = req.body
    if (!userId || !postId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await knex("applyList").insert({
      content: content,
      offer: offer,
      user_id: userId,
      post_id: postId,
    })
    return res.status(201).json({ message: "Apply successfully" });

  }
  catch (error) {
    res.status(500).json({ message: error });
  };
};

const getApplicantsById = (req, res) => {
  const postId = req.params.postID;
  knex("applyList")
    .where("post_id", postId)
    .orderBy("updatedAt", "desc")
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
