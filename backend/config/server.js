const SECRET = process.env.SECRET || "";
const DATABASE = process.env.DATABASE || "mongodb://localhost:27017/highlow";
const PORT = process.env.PORT || 3000;

module.exports = { SECRET, DATABASE, PORT };
