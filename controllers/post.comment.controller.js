const db = require("../config/db");

// Add Comment
exports.addComment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { post_id, comment } = req.body;
    if (!post_id || !comment?.trim()) {
      return res.status(400).json({ message: "post_id and comment are required" });
    }
    const query = `
      INSERT INTO post_comments (post_id, user_id, comment)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.query(query, [post_id, userId, comment.trim()]);

    return res.status(201).json({
      message: "Comment added successfully",
      id: result.insertId
    });
  } catch (error) {
    console.error("addComment Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get All Comments for a Post
exports.getCommentsByPost = async (req, res) => {
  try {
    const { post_id } = req.params;

    const query = `
      CALL getPostComments(?)
    `;
    const [comments] = await db.query(query, [post_id]);

    return res.json(comments[0]);
  } catch (error) {
    console.error("getCommentsByPost Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const query = `
      DELETE c FROM post_comments c
      JOIN post p ON c.post_id = p.id
      WHERE c.id = ? AND (c.user_id = ? OR p.user_id = ?)
    `;
    const [result] = await db.query(query, [id, userId, userId]);
    return res.json({
      message: result.affectedRows > 0 ? "Comment deleted" : "Comment not found or not authorized"
    });
  } catch (error) {
    console.error("deleteComment Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get Comment Count for a Post
exports.getCommentCount = async (req, res) => {
  try {
    const { post_id } = req.params;
    const [rows] = await db.query(
      `SELECT  getCommentCount(?) as Count `,
      [post_id]
    );
    return res.json(rows);
  } catch (error) {
    console.error("getCommentCount Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// exports.getCommentData = async (req, res) => {
//   try {
//     const { post_id } = req.params;
//     const [rows] = await db.query(
//       `SELECT *  frmtDate(?) as Date from  `,
//       [post_id]
//     );
//     return res.json(rows);
//   } catch (error) {
//     console.error("getCommentCount Error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


