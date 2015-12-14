///<reference path="./.d.ts"/>
"use strict";

import Future = require("fibers/future");
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
let bplistParser = require("bplist-parser");
let osenv = require("osenv");

export function getInstalledApplications(deviceId: string): IFuture<IApplication[]> {
	return (() => {
		let rootApplicationsPath = path.join(osenv.home(), `/Library/Developer/CoreSimulator/Devices/${deviceId}/data/Containers/Bundle/Application`);
		if(!fs.existsSync(rootApplicationsPath)) {
			rootApplicationsPath = path.join(osenv.home(), `/Library/Developer/CoreSimulator/Devices/${deviceId}/data/Applications`);
		}
		let applicationGuids = fs.readdirSync(rootApplicationsPath);
		let result: IApplication[] = [];
		_.each(applicationGuids, applicationGuid => {
			let fullApplicationPath = path.join(rootApplicationsPath, applicationGuid);
			if (fs.statSync(fullApplicationPath).isDirectory()) {
				let applicationDirContents = fs.readdirSync(fullApplicationPath);
				let applicationName = _.find(applicationDirContents, fileName => path.extname(fileName) === ".app");
				let plistFilePath = path.join(fullApplicationPath, applicationName, "Info.plist");
				let applicationData = parseFile(plistFilePath).wait();
				result.push({
					guid: applicationGuid,
					appIdentifier: applicationData[0].CFBundleIdentifier,
					path: path.join(fullApplicationPath, applicationName)
				});
			}
		});

		console.log("INSTALLED APPLICATIONS", result);

		return result;
	}).future<IApplication[]>()();
}

function parseFile(plistFilePath: string): IFuture<any> {
	let future = new Future<any>();
	bplistParser.parseFile(plistFilePath, (err: Error, obj: any) => {
		if(err) {
			future.throw(err);
		} else {
			future.return(obj);
		}
	});
	return future;
}