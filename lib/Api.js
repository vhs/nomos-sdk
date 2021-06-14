import url from "url";
import https from "https";

export default class API {
  constructor(context) {
    this.context = context;

    return new Proxy(this, {
      get: (target, service, receiver) => {
        return new Proxy(target, {
          get: (t, method) => {
            return async (params, options = {}) => {
              return t.exec.bind(t)(service, method, params, options);
            };
          }
        });
      }
    });
  }

  async exec(service, method, params, options = {}) {
    const uri = new url.URL(`${this.context.config.servicesPath}/${service}.svc/${method}`, this.context.config.baseUrl);

    this.context.log.debug(Date.now(), uri, params);

    const postData = params ? JSON.stringify(params) : "";
    const postLen = Buffer.byteLength(postData);
    const cookie = this.context.session.sessionid ? `PHPSESSID=${this.context.session.sessionid}` : undefined;

    return new Promise((resolve, reject) => {
      const req = https.request(uri, {
        method: postLen > 0 ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": postLen,
          ...(cookie ? { Cookie: cookie } : {})
        },
        ...(options || {}),
      }, (res) => {
        const timeout = setTimeout(() => {
          reject(new Error("timeout"));
        }, 10000);
        let data = "";

        res.setEncoding("utf8");
        res.on("data", chunk => {
          data += chunk;
        });

        res.on("end", () => {
          clearTimeout(timeout);
          let resp = undefined;

          if (data) {
            try {
              resp = JSON.parse(data);
            } catch (e) {
              resp = data;
            }
          }

          const envelope = {
            statusCode: res.statusCode,
            headers: res.headers,
            data: resp,
          };

          this.context.log.debug(Date.now(), envelope);

          resolve(envelope);
        });

        res.on("error", (e) => {
          clearTimeout(timeout);
          reject(e);
        });
      });

      if (postLen > 0) {
        req.write(postData);
      }

      req.end();
    });
  }
}
