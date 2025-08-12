const db = require("../config/db");

exports.CreateMedia = async (req, res) => {
  try {
    const { feed_id } = req.body;

    if (!feed_id || !req.files?.media || req.files.media.length === 0 || !req.files?.thumb) {
      return res.status(400).json({ message: "feed_id, thumb and media files are required" });
    }

    const thumbUrl = req.files.thumb[0].path;
    let mediaArray = req.files.media.map(file => file.path);

    const mediaData = mediaArray.map(url => [feed_id, url, thumbUrl]);

    const query = "INSERT INTO feed_media (feed_id, media, thumb) VALUES ?";
    await db.query(query, [mediaData]);

    res.status(201).json({
      message: "Media uploaded successfully",
      thumb: thumbUrl,
      media: mediaArray
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


exports.deleteMedia = async (req, res) => {
  try {
   const {id,feed_id}=req.body

    const query = `DELETE From  feed_media where id = ? AND feed_id = ? `;
    const [result] = await db.query(query, [id,feed_id]);

    if (result.affectedRows > 0) {
      res.json({
        message: "media Post Deleted successfully",
      });
    } else {
      res.json({
        message: "post Not found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
