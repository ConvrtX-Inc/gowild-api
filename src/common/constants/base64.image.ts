import {Base64String} from "aws-sdk/clients/wellarchitected";
import { v4 as uuidv4 } from 'uuid';
import * as fs from "fs";
import path from "path";
import * as process from "process";
export function convertToImage(
    image: Base64String,
    extension: string
): string {
    // Currently set for local path only
    const filePath = `/files/${uuidv4()}.${extension}`;
    const buffer = Buffer.from(image, "base64");
    fs.writeFileSync(`${process.cwd()}${filePath}`, buffer);

    return `/${process.env.API_PREFIX}/v1/${filePath}`;
}