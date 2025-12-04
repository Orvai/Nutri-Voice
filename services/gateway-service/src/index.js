// gateway/src/index.js
import "dotenv/config";   // 👈 חובה להיות בשורה הראשונה
import app from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
