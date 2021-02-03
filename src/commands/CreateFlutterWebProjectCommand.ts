import { join } from "path";
import * as vscode from "vscode";
import { openVsCode } from "../constants";
import { checkForVSCodeCLI } from "../dependencies/checkForVSCode";

import { createFlutterWebApp } from "../installer/installFlutter";
import { error } from "../logger";
import { exec } from "../runCommand";
import { DashboardCommandHandler } from "../webview/dashboard/DashboardCommandHandler";

export class CreateFlutterWebProjectCommand {
  
  /*
  * Command Class for creating a flutter web project
  * - Open a folder picker or use the current workspace
  * - Ask for project name (Default: `flutter_matic_starter_project`
  * - Run `flutter create ${name}`
  * - Open VSCode in the new project directory (Error if not in $PATH)
  */

  dashboardCommandHandler: DashboardCommandHandler;

  constructor(dashboardCommandHandler: DashboardCommandHandler) {
    this.dashboardCommandHandler = dashboardCommandHandler;
  }

  async run() {
    this.dashboardCommandHandler.updateOutputList({
      info: "Starting webapp creation",
      success: true,
    });

    const currentWorkspace = vscode.workspace.workspaceFolders;

    let folderPath = "";

    // Show folder picker if workspace does not exist
    if (!currentWorkspace) {
      const file = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
      });
      if (!file) {
        vscode.window.showErrorMessage(
          "You need to pick one folder to continue or be in a workspace"
        );
        return;
      }
      folderPath = file[0].fsPath;
    } else {
      folderPath = currentWorkspace[0].uri.fsPath;
    }

    this.dashboardCommandHandler.updateOutputList({
      info: `Using: ${folderPath}`,
      success: true,
    });

    this.dashboardCommandHandler.updateOutputList({
      info: "The project name should not include spaces and numbers. It should conform to the Dart Package guidelines",
      success: true
    });

    const projectName = await vscode.window.showInputBox({
      value: "flutter_matic_starter_project",
    });

    if (!projectName) {
      vscode.window.showErrorMessage("Project name can not be empty!");
      return;
    }

    // TODO Do a better regex based match later on
    if (projectName?.includes("-") || projectName?.includes(" ")) {
      vscode.window.showErrorMessage(
        "Follow the dart package name guidelines!"
      );
      this.dashboardCommandHandler.updateOutputList(error(""));
      return;
    }

    this.dashboardCommandHandler.updateOutputList(
      await createFlutterWebApp(folderPath, projectName)
    );

    // Open project in a new window
    const vsCodeCliOutput = await checkForVSCodeCLI();
    if (vsCodeCliOutput.success) {
      await exec(`code ${join(folderPath, projectName)}`);
    } else {
      this.dashboardCommandHandler.updateOutputList(error(openVsCode));
    }
  }
}
