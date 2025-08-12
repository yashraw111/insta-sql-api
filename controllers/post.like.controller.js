const db = require("../config/db");

exports.toggleLike = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id: post_id } = req.params;

    // Check if record already exists
    const [check] = await db.query(
      `SELECT * FROM post_like WHERE post_id = ? AND user_id = ?`,
      [post_id, user_id]
    );
    console.log(check)

    if (check.length > 0) {
      // Toggle the status
      const newStatus = check[0].status === 1 ? 0 : 1;
      console.log(newStatus)
      await db.query(
        `UPDATE post_like SET status = ? WHERE post_id = ? AND user_id = ?`,
        [newStatus, post_id, user_id]
      );

      return res.status(200).json({
        message:
          newStatus === 1
            ? "Post liked successfully"
            : "Post unliked successfully",
      });
    } else {
      // Insert new like
      await db.query(
        `INSERT INTO post_like (post_id, user_id, status) VALUES (?, ?, 1)`,
        [post_id, user_id]
      );

      return res.status(201).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
