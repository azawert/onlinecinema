import { Injectable } from '@nestjs/common';
import { FileInterface } from "./interface/file.interface";
import { path } from "app-root-path";
import {ensureDir,writeFile} from "fs-extra";

@Injectable()
export class FileService {
  async saveFiles(files: Express.Multer.File[], folder:string = 'default'):Promise<FileInterface[]>{
    const uploadFolder = `${path}/uploads/${folder}`
    await ensureDir(uploadFolder)

    const res:FileInterface[] = await Promise.all(
      files.map(async file => {
        await writeFile(`${uploadFolder}/${file.originalname}`,file.buffer)

        return {
         url: `/uploads/${folder}/${file.originalname}`,
         name: file.originalname
        }
      })
    )
    return res
  }
}
