import {fileURLToPath} from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
//one folder level down from this file as utils.js is in src/utils and not in src
const __dirname = path.join(dirname(__filename), `../`);

export default __dirname;
