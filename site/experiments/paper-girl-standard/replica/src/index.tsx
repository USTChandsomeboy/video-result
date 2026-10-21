import {registerRoot,Composition} from "remotion";
import {Replica} from "./Replica";
import "./provided-fonts.css";
registerRoot(()=> <Composition id="Replica" component={Replica} width={720} height={720} fps={24} durationInFrames={672}/>);
