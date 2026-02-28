const bcrypt = require("bcryptjs");

async function hash() {
  const hashed = await bcrypt.hash("123456", 10);
  console.log(hashed);
}

hash();
