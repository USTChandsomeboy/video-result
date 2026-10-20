import {registerRoot,Composition} from "remotion";
import {Replica} from "./Replica";
import "./provided-fonts.css";
registerRoot(()=> <Composition id="Replica" component={Replica} width={1920} height={1080} fps={25} durationInFrames={500}/>);
