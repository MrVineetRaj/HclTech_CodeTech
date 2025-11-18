import { envConf } from "./app/lib/envConf";
import { initiateNotificationJob } from "./app/notification-worker";

initiateNotificationJob({
  redisHost: envConf.REDIS_HOST,
  redisPort: +envConf.REDIS_PORT,
});
