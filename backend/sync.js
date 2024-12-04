const models = require("./db");

(async () => {
  try {
    await models.sequelize.syc({ force: true });
    console.log("Anonymus Grading Database was synced!");
  } catch (err) {
    console.log("Error syncing database", err);
  } finally {
    process.exit();
  }
})();
