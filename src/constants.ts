import { homedir } from "os";
import { join } from "path";

export const EXTENSION_ID = "flutter-matic";
export const INSTALL_FLUTTER_COMMAND = "install-flutter"

export const gitCloneCommand = (process.platform === 'win32') ?
  `git clone --branch beta https://github.com/flutter/flutter.git "${join(
    homedir(),
    ".flutter-sdktest"
  )}"` :
  `git clone --depth 1 --branch beta https://github.com/flutter/flutter.git "${join(
    homedir(),
    ".flutter-sdktest"
  )}"`;

export const flutterCommand = `flutter`;
export const flutterInitCommand = `flutter doctor`;
export const configEnableWebFlutter = `flutter config --enable-web`;
