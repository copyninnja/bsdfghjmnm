const http = require("http");
const url = require("url");
const Firestore = require("@google-cloud/firestore");

const server = http.createServer((req, res) => {
  if (req.url !== "/favicon.ico") {
    // 因接收時會一併取得 undefined 的 facicon.ico，使用簡單的邏輯排除
    const params = url.parse(req.url, true).query; // 取得網址每個參數
    const collection = params.collection || "default";
    const doc = params.doc || "default";
    let data;
    if (params.data) {
      data = JSON.parse(params.data);
    }
    const type = params.type;

    const firestore = new Firestore({
      projectId: params.projectid,
      keyFilename: "key.json", // 放入金鑰 json
    });
    const ref = firestore.collection(collection).doc(doc);

    switch (
      type // 依據不同的參數寫入或讀取資料
    ) {
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
});
server.listen(5000);
