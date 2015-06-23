var MongoDB = require("mongodb").MongoClient;
var POST_COLLECTION = "posts";

module.exports = {

    db_path: "mongodb://localhost:27017/forum",

    /**
     * Get all records as an array
     * @param callback {function(err {bool}, data {Object[]})}
     */
    getAllCategories: function(callback) {
        MongoDB.connect(this.db_path, function(err, db) {
            if (err) {
                callback(true, false);
                return;
            }
            db.collection(POST_COLLECTION).aggregate(
                { $group: { _id: "$category", posts: { $sum: 1 }, last: { $max: "$date" } } },
                { $sort: { _id: 1 } }
            ).toArray(function(err, docs) {
                if (err) {
                    callback(true, null);
                    return;
                }

                callback(false, docs);

                db.close();

            });
        });
    },

    getPostsForCategory: function(category, callback) {
        MongoDB.connect(this.db_path, function(err, db) {
            if (err) {
                callback(true, false);
                return;
            }
            db.collection(POST_COLLECTION).find({
                category: category
            }).sort({
                date: 1,
                title: 1
            }).toArray(function(err, docs) {
                if (err) {
                    callback(true, null);
                } else {
                    callback(false, docs);
                }
            });
        });
    }

};