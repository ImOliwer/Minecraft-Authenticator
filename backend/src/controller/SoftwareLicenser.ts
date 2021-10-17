import NodeRSA from "node-rsa";
import FileSystem from "fs";
import { lib as CryptoLib, AES, enc } from "crypto-js";

/**
 * This class represents a licenser system for our software.
 *
 * Please note that this class contains all content of which
 * are written, presented & uploaded by "github@timtutt",
 * and is existent under https://github.com/timtutt/software-license-key
 * as well as https://www.npmjs.com/package/software-license-key.
 * I've only just made some really small changes & this class
 * was mostly created to avoid declaration porting from JS alone.
 *
 * @author timtutt
 * @author Oliwer
 */
export default class SoftwareLicenser {
  secretKey: NodeRSA;
  
  constructor(secretKey: NodeRSA.Key) {
    this.secretKey = new NodeRSA(secretKey);
  }

  create(data?: object): string {
    if (!this.secretKey.isPrivate()) {
      throw "Cannot create a new license key. The provided secret is not of state 'private'.";
    }

    const exactData = JSON.stringify(data || {});
    const randomSymmetricKey = CryptoLib.WordArray.random(128/8).toString(enc.Base64);
    const encryptedData = AES.encrypt(exactData, randomSymmetricKey).toString();
    const finalSymmetricKey = this.secretKey.encryptPrivate(randomSymmetricKey, 'base64');
    const message = `${finalSymmetricKey}||${encryptedData}`;
    const signature = this.secretKey.sign(exactData, 'base64');

    return `====BEGIN LICENSE KEY====\n${message}\n${signature}\n====END LICENSE KEY====`;
  }

  validate<Type>(key: string): Type | null {
    const lines = key.split("\n");
    const message = lines[1].split("||");
    
    try {
      const randomSymmetricKey = this.secretKey.decryptPublic(message[0], 'utf8');
      const decryptedData = AES.decrypt(message[1], randomSymmetricKey).toString(enc.Utf8);
      if (!this.secretKey.verify(decryptedData, lines[2], undefined, 'base64'))
        return null;
      return JSON.parse(decryptedData);
    } catch ($) {
      return null;
    }
  }

  validateByPath<Type>(path: FileSystem.PathOrFileDescriptor): Promise<Type> {
    return new Promise((resolve, reject) => {
      FileSystem.readFile(path, (error, data) => {
        if (error) {
          return reject();
        }

        console.log(data.toString());
        const validated = this.validate(data.toString());
        if (validated == null) {
          return;
        }

        return resolve(validated as Type);
      });
    });
  }
}
