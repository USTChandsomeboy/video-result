import {Composition, registerRoot} from 'remotion';
import {Replica} from './Replica';

const Root = () => <Composition id="Replica" component={Replica} width={1920} height={1080} fps={30} durationInFrames={900}/>;

registerRoot(Root);
