import {registerRoot,Composition} from "remotion";
import {Replica} from "./Replica";
import "./provided-fonts.css";
registerRoot(()=> <Composition id="Replica" component={Replica} width={1920} height={1080} fps={30} durationInFrames={2342}/>);
