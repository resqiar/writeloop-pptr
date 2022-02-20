import "dotenv/config";
import Fastify from "fastify";
import * as closeWithGrace from "close-with-grace";

const app = Fastify();

import appService from "./app";
app.register(appService);

const closeListeners = closeWithGrace(
  { delay: 500 },
  async function ({ err }: any) {
    if (err) {
      app.log.error(err);
    }
    await app.close();
  }
);

app.addHook("onClose", async (_instance, done) => {
  closeListeners.uninstall();
  done();
});

const start = async () => {
  try {
    await app.listen(process.env.PORT || 3033);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
