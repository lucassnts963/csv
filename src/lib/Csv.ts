import { createReadStream } from "fs";
import readline from "readline";

export interface IFile {
  path: string;
}

interface IOptions {
  delimiter: ";" | "|" | "," | string;
  hasColumnsName: boolean;
  columnsName?: string[];
}

const optionsDefault = {
  delimiter: ";",
  hasColumnsName: false,
  columnsName: [],
};

export class Csv {
  private file: IFile;
  private options: IOptions;
  private objects: Object[];

  arrayOfObject(array: string[]) {
    if (array) {
      let obj = {};
      const { columnsName, hasColumnsName } = this.options;

      columnsName?.map((val, index, itens) => {
        const column = val.replaceAll('"', "").replaceAll("'", "");

        Object.assign(obj, { [column]: array[index] });
      });

      this.objects.push(obj);
    }
  }

  async read() {
    const { path } = this.file;

    const readableFile = createReadStream(path);

    const transactionLines = readline.createInterface({
      input: readableFile,
    });

    let count = 0;
    let arrayOfObject = [];

    for await (let line of transactionLines) {
      const array = line.split(this.options.delimiter);

      if (this.options.hasColumnsName && count === 0) {
        this.options.columnsName = array;
      } else {
        arrayOfObject.push();
      }
    }
  }

  constructor(file: IFile, options = optionsDefault) {
    this.file = file;
    this.options = options;
    this.objects = [];
  }
}
