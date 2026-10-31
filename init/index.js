const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const data = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to Database");
    try {
        await initDB();
    } finally {
        await mongoose.connection.close();
    }
}

const initDB = async () => {
    await Listing.deleteMany({});
    const listings = data.data.map((obj) => ({
        ...obj,
        owner: "6ad458beea6cd271c8c166d4",
    }));
    await Listing.insertMany(listings);
    console.log(" data was initialized");
};

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
