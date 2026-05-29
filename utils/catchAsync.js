export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      if (res.headersSent) {
        return next(err);
      }

      console.error("🔥 ERROR:", err);

      // Extract real message safely
      const message =
        err?.message ||
        err?.msg ||
        (typeof err === "string" ? err : JSON.stringify(err));

      // Validation Error
      if (err.name === "ValidationError") {
        return res.status(400).json({
          status: "failed",
          msg: message,
        });
      }

      // Duplicate key (Mongo)
      if (err.code === 11000) {
        return res.status(400).json({
          status: "failed",
          msg: "Duplicate field value error",
        });
      }

      // Cast error
      if (err.name === "CastError") {
        return res.status(400).json({
          status: "failed",
          msg: "Invalid ID format",
        });
      }

      // Default error
      return res.status(500).json({
        status: "failed",
        msg: message,
      });
    });
  };
};