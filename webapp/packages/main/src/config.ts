import {isMacintosh} from './utils/env';
import getAlasABSPath from './utils/getAlasABSPath';

const yaml = require('yaml');
const fs = require('fs');
const path = require('path');

function getAlasPath() {
  let file;
  const currentFilePath = process.cwd();
  const pathLookup = [
    // Current
    './',
    // Running from AzurLaneAutoScript/toolkit/WebApp/alas.exe
    '../../',
    // Running from AzurLaneAutoScript/webapp/dist/win-unpacked/alas.exe
    '../../../',
    // Running from `yarn watch`
    './../',
  ];
  for (const i in pathLookup) {
    file = path.join(currentFilePath, pathLookup[i], './config/deploy.yaml');
    if (fs.existsSync(file)) {
      return path.join(currentFilePath, pathLookup[i]);
    }
  }
  for (const i in pathLookup) {
    file = path.join(currentFilePath, pathLookup[i], './config/deploy.template.yaml');
    if (fs.existsSync(file)) {
      return path.join(currentFilePath, pathLookup[i]);
    }
  }
  return currentFilePath;
}

function getLauncherPath(alasPath: string) {
  const pathLookup = ['./Alas.exe', './Alas.bat', './deploy/launcher/Alas.bat'];
  for (const i in pathLookup) {
    const file = path.join(alasPath, pathLookup[i]);
    if (fs.existsSync(file)) {
      return path.join(alasPath, pathLookup[i]);
    }
  }
  return path.join(alasPath, './Alas.exe');
}

export const alasPath = isMacintosh && import.meta.env.PROD ? getAlasABSPath() : getAlasPath();

const file = fs.readFileSync(path.join(alasPath, './config/deploy.yaml'), 'utf8');
const config = yaml.parse(file) as DefAlasConfig;
const PythonExecutable = config.Deploy.Python.PythonExecutable;
const WebuiPort = config.Deploy.Webui.WebuiPort.toString();
const Theme = config.Deploy.Webui.Theme;

export const ThemeObj: {[k in string]: 'light' | 'dark' | 'system'} = {
  default: 'light',
  light: 'light',
  dark: 'dark',
  system: 'system',
};

export const pythonPath = path.isAbsolute(PythonExecutable)
  ? PythonExecutable
  : path.join(alasPath, PythonExecutable);
export const installerPath = import.meta.env.DEV ? 'installer_test.py' : 'installer_test.py';
export const installerArgs = import.meta.env.DEV ? [] : [];
export const webuiUrl = `http://127.0.0.1:${WebuiPort}`;
export const webuiPath = 'gui.py';
export const webuiArgs = ['--port', WebuiPort, '--electron'];
export const dpiScaling =
  Boolean(config.Deploy.Webui.DpiScaling) || config.Deploy.Webui.DpiScaling === undefined;

export const webuiTheme = ThemeObj[Theme] || 'light';
