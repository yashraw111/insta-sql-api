const db = require("../config/db");

// Create Feed
exports.CreateFeed = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { type_feed, caption } = req.body;

    if (!type_feed) {
      return res.status(400).json({ message: "type_feed is required" });
    }

    const status = type_feed == 1 ? 1 : 0;

    const query = `
      INSERT INTO post (user_id, type_feed, caption, status)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      userId,
      type_feed,
      caption || null,
      status,
    ]);

    return res.status(201).json({
      message: "Feed created successfully",
      id: result.insertId,
      autoPublished: status === 1,
    });
  } catch (error) {
    console.error("CreateFeed Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// My All Published Posts
// exports.myAllPost = async (req, res) => {
//   try {
//     const user_id = req.user?.id;

//     const query = `
//       SELECT
//         P.id,
//         P.user_id,
//         P.type_feed,
//         P.caption,
//         P.status,
//         P.created_at,
//         P.updated_at,
//         IFNULL(l.like_count, 0) AS like_count,
//         IFNULL(c.comment_count, 0) AS comment_count,
//         JSON_ARRAYAGG(
//           JSON_OBJECT(
//             'id', F.id,
//             'media', F.media,
//             'thumb', F.thumb
//           )
//         ) AS media
//       FROM post AS P
//       LEFT JOIN feed_media AS F ON P.id = F.feed_id
//       LEFT JOIN (
//         SELECT post_id, COUNT(*) AS like_count
//         FROM post_like
//         GROUP BY post_id
//       ) AS l ON P.id = l.post_id
//       LEFT JOIN (
//         SELECT post_id,COUNT(*) AS comment_count
//         FROM post_comments
//         GROUP BY post_id
//       ) AS c ON P.id = c.post_id
//       WHERE P.user_id = ? AND P.status = 1
//       GROUP BY P.id
//       ORDER BY P.created_at DESC
//     `;

//     const [result] = await db.query(query, [user_id]);

//     result.forEach((post) => {
//       if (post.media && post.media[0] === null) {
//         post.media = [];
//       }
//     });

//     return res.json(result);
//   } catch (error) {
//     console.error("myAllPost Error:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };
exports.myAllPost = async (req, res) => {
  try {
    const user_id = req.user?.id;

    const [myAllPost] = await db.query(`select * from post where user_id = ?`, [
      user_id,
    ]);

    for (let index = 0; index < myAllPost.length; index++) {
      const [media] = await db.query(
        `SELECT * FROM feed_media WHERE feed_id = ?`,
        [myAllPost[index].id]
      );
      myAllPost[index].media = media;
      const [comment] = await db.query(
        "SELECT * from post_comments where post_id = ?",
        [myAllPost[index].id]
      );
      myAllPost[index].comment = comment;
      return res.json(myAllPost);
    }
    return res.json(myAllPost);
  } catch (error) {
    console.error("myAllPost Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// Publish Post
exports.postPublish = async (req, res) => {
  try {
    const { post_id } = req.body;
    if (!post_id) {
      return res.status(400).json({ message: "post_id is required" });
    }

    const query = `UPDATE post SET status = 1 WHERE id = ? AND status != 1`;
    const [result] = await db.query(query, [post_id]);

    return res.json({
      message:
        result.affectedRows > 0
          ? "Post published successfully"
          : "No change — post may already be published",
      postUpdated: result,
    });
  } catch (err) {
    console.error("postPublish Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
// Delete Post
exports.deletePost = async (req, res) => {
  try {
    const post_id = req.params.id;

    const query = `DELETE FROM post WHERE id = ?`;
    const [result] = await db.query(query, [post_id]);

    return res.json({
      message:
        result.affectedRows > 0
          ? "Post deleted successfully"
          : "Post not found",
    });
  } catch (err) {
    console.error("deletePost Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Check if post exists
    const [postRows] = await db.query(`SELECT * FROM post WHERE id = ?`, [id]);
    if (postRows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    const [media] = await db.query(
      `SELECT * FROM feed_media WHERE feed_id = ?`,
      [postRows[0].id]
    );
    postRows[0].media = media;
    const [comment] = await db.query(
      "SELECT * from post_comments where post_id = ?",
      [postRows[0].id]
    );

    postRows[0].comment = comment;

    return res.json(postRows[0]);
  } catch (error) {
    console.error("getPostById Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
