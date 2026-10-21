import {Config} from "@remotion/cli/config";
if(process.env.REMOTION_BROWSER_EXECUTABLE)Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
