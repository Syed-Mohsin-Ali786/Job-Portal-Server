// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://a09c1026127fb43819af118da5b55fca@o4510330992066560.ingest.us.sentry.io/4510331003273216",
  integrations: [Sentry.mongoIntegration()],
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
