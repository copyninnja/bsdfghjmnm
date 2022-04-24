const url = require("url");
const Firestore = require("@google-cloud/firestore");

exports.helloWorld = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.url !== "/favicon.ico") {
    const params = url.parse(req.url, true).query;
    const collection = params.collection || "default";
    const doc = params.doc || "default";
    let data;
    if (params.data) {
      data = JSON.parse(params.data);
    }
    const type = params.type;

    const firestore = new Firestore({
      projectId: params.projectid,
      keyFilename: "key.json",
    });
    const ref = firestore.collection(collection).doc(doc);

    switch (type) {
      case "set":
        ref.set(data).then(() => {
          res.end(`set data to "${doc}" ok`);
        });
        break;
      case "add":
        ref.add(data).then(() => {
          res.end(`add data to "${doc}" ok`);
        });
        break;
      case "get":
        firestore
          .collection(collection)
          .get()
          .then((e) => {
            let html = "";
            e.forEach((d) => {
              html = `${html}<div>${d.id} : ${d.data().total} / ${
                d.data().good
              }</div>`;
            });
            res.end(html);
          });
        break;
    }
  }
};
