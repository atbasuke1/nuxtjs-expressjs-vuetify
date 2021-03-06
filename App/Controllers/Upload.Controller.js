const upload = require("../middleware/upload");
const dbConfig = require("../config/db");
const { MongoClient, GridFSBucket, ObjectID } = require('mongodb')
const url = dbConfig.url;
const baseUrl = "http://localhost:8081/photos/";
const mongoClient = new MongoClient(url);

//upload files
const uploadFiles = async (req, res) => {
    try {
        await upload(req, res);
        console.log("helo");
        console.log(req.files);

        if (req.files.length <= 0) {
            return res
                .status(400)
                .send({ message: "You must select at least 1 file." });
        }
        return res.status(200).send({
            message: "Files have been uploaded.",
        });
    } catch (error) {
        console.log(error);
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).send({
                message: "Too many files to upload.",
            });
        }
        return res.status(500).send({
            message: `Error when trying upload many files: ${error}`,
        });
    }
};

//get list
const getListFiles = async (req, res) => {
    try {
        await mongoClient.connect();
        const database = mongoClient.db(dbConfig.database);
        const images = database.collection(dbConfig.imgBucket + ".files");
        let fileInfos = [];
        const cursor = images.find({});

        if ((await cursor.count()) === 0) {
            return res.status(500).send({
                message: "No files found!",
            });
        }
        await cursor.forEach((doc) => {
            fileInfos.push({
                name: doc.filename,
                url: baseUrl + doc.filename,
                id: doc._id,
                contentType: doc.contentType
            });
        });
        return res.status(200).send(fileInfos);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
//download photo
const download = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const bucket = new GridFSBucket(database, {
            bucketName: dbConfig.imgBucket,
        });

        let downloadStream = bucket.openDownloadStreamByName(req.params.name);

        downloadStream.on("data", function (data) {
            return res.status(200).write(data);
        });

        downloadStream.on("error", function (err) {
            return res.status(404).send({ message: "Cannot download the Image!" });
        });

        downloadStream.on("end", () => {
            return res.end();
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
//delete from id
const deleteOne = async (req, res) => {
    try {
        console.log("da vao delete");
        const id = req.params.id;
        console.log("Data deleted", req.params.id);
        await mongoClient.connect(() => {
            const image = mongoClient.db("Nuxt").collection("photos.files")
            image.deleteOne({ _id: new ObjectID(id) }).then(function (err, docs) {
                if (err) {
                    console.log(err)
                    res.send({ message: err })
                } else {
                    res.status(200).send({
                        message: "deleted successfully.",
                    });
                }

            })
        });
    } catch (error) {
        console.log("da vao delete nhung erro");
    }
}

//delete many selected
const deleteMany = async (req, res) => {
    console.log("da vao delete many");
    const listIds = req.params.id;
    const test = listIds.split(',')
    console.log("manyid", test);
    mongoClient.connect();
    const images = mongoClient.db("Nuxt").collection("photos.files")
    try {
        await Promise.all(test.map(id => images.deleteOne({
            _id: ObjectID(id)
        })))
        res.status(200).send({
            message: " deleted successfully."
        })
    } catch (err) {
        res.status(500).send({
            message: err
        })
    }
}

module.exports = {
    deleteOne,
    download,
    deleteMany,
    uploadFiles,
    getListFiles,
};