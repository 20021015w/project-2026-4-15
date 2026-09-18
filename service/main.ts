import "dotenv/config";
import { app } from "./src/app.js";
import { config } from "./src/config.js";

app.listen(config.port, () => {
  console.log(`[service] listening on http://localhost:${config.port}`);
});
