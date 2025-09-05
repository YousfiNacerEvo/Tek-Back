const dotenv = require('dotenv');
const app = require('./app');
const { logInfo } = require('./utils/logger');

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logInfo(`Server running on port ${PORT}`);
});

