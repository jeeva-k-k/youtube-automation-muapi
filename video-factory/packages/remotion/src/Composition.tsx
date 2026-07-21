import React from 'react';
import { AbsoluteFill, Audio, CalculateMetadataFunction, Composition, getInputProps, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { ChemosynthesisVisual } from './visuals/ChemosynthesisVisual';
import { DnaVisual } from './visuals/DnaVisual';
import { SpacetimeVisual } from './visuals/SpacetimeVisual';
import { CoriolisVisual } from './visuals/CoriolisVisual';
import { MpembaVisual } from './visuals/MpembaVisual';
import { GlassShatterVisual } from './visuals/GlassShatterVisual';
import { NeuronFireVisual } from './visuals/NeuronFireVisual';
import { PhotosynthesisVisual } from './visuals/PhotosynthesisVisual';
import { LaserVisual } from './visuals/LaserVisual';
import { VenusDayVisual } from './visuals/VenusDayVisual';
import { SaturnFloatVisual } from './visuals/SaturnFloatVisual';
import { JupiterDayVisual } from './visuals/JupiterDayVisual';
import { NeptuneWindVisual } from './visuals/NeptuneWindVisual';
import { SunVanishVisual } from './visuals/SunVanishVisual';
import { SunEarthScaleVisual } from './visuals/SunEarthScaleVisual';
import { ExoplanetRainVisual } from './visuals/ExoplanetRainVisual';
import { NebulaColdVisual } from './visuals/NebulaColdVisual';
import { WeightCompareVisual } from './visuals/WeightCompareVisual';
import { SoundVacuumVisual } from './visuals/SoundVacuumVisual';
import { HumanBodyVisuals } from './visuals/HumanBodyVisuals';
import { AnimalVisuals } from './visuals/AnimalVisuals';
import { EarthEnvironmentVisuals } from './visuals/EarthEnvironmentVisuals';
import { PhysicsChemistryVisuals } from './visuals/PhysicsChemistryVisuals';
import { BootesVoidVisual } from './visuals/BootesVoidVisual';
import { QuantumTunnelingVisual } from './visuals/QuantumTunnelingVisual';

export interface SceneConfig { id: string; start: number; end: number; eyebrow: string; title: string; visual: { type: string } }
export interface CaptionPhrase { start: number; end: number; text: string }
export interface ProjectData { project_id: string; theme: string; title: string; eyebrow: string; format: { width: number; height: number; fps: number; duration: number }; scenes: SceneConfig[]; captions: CaptionPhrase[]; audioPath: string }

const SubtitleRenderer: React.FC<{ captions: CaptionPhrase[]; t: number }> = ({ captions, t }) => {
  const active = captions.find(c => t >= c.start && t <= c.end);
  if (!active) return null;
  return <div style={{ fontSize: '38px', fontWeight: 'bold', color: '#fff', textAlign: 'center', padding: '14px 30px', background: 'rgba(5,5,10,0.85)', borderRadius: '20px', border: '1px solid rgba(0,240,255,0.4)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', textShadow: '0 2px 4px rgba(0,0,0,0.5)', maxWidth: '900px', lineHeight: '1.35' }}>{active.text}</div>;
};

const ProjectVisualRouter: React.FC<{ projectId: string; sceneId: string; title: string; eyebrow: string; theme: string }> = ({ projectId, sceneId, title, eyebrow, theme }) => {
  switch (projectId) {
    case 'quantum-tunneling-solid-barriers':
    case 'V052':
      return <QuantumTunnelingVisual sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'bootes-void-universe-silence':
    case 'V051':
      return <BootesVoidVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'chemosynthetic-vent': return <ChemosynthesisVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'dna-hydrogen-bonds': return <DnaVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'spacetime-well': return <SpacetimeVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'coriolis-deflection': return <CoriolisVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'mpemba-paradox': return <MpembaVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'glass-shatter-resonance': return <GlassShatterVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'neuron-firing-potential': return <NeuronFireVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'photosynthesis-water-split': return <PhotosynthesisVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'laser-stimulated-emission': return <LaserVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'venus-day-rotation': return <VenusDayVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'saturn-water-float': return <SaturnFloatVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'jupiter-day-rotation': return <JupiterDayVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'neptune-wind-speed': return <NeptuneWindVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'sun-vanish-gravity': return <SunVanishVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'sun-earth-scale': return <SunEarthScaleVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'exoplanet-rain-glass': return <ExoplanetRainVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'nebula-boomerang-cold': return <NebulaColdVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'weight-compare-planets':
    case 'weight-planets-compare': return <WeightCompareVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    case 'sound-vacuum-space': return <SoundVacuumVisual sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
    
    // Human Body
    case 'cornea-no-vessels':
    case 'heart-daily-pump':
    case 'liver-regrowth-speed':
    case 'brain-tickle-prediction':
    case 'blush-vessel-adrenaline':
    case 'nerve-impulse-saltatory':
    case 'bone-steel-strength':
    case 'finger-wrinkle-constriction':
    case 'sleep-deprived-attention':
    case 'stomach-acid-corrosive':
      return <HumanBodyVisuals projectId={projectId} sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;

    // Animals
    case 'octopus-hearts-blue':
    case 'tardigrade-space-survival':
    case 'crab-blood-endotoxin':
    case 'shrimp-vision-photoreceptors':
    case 'croc-bite-force':
    case 'gecko-setae-adhesion':
    case 'axolotl-regrow-blastema':
    case 'woodpecker-hammer-decel':
    case 'ant-lift-scaling':
    case 'roach-spiracles-survival':
      return <AnimalVisuals projectId={projectId} sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;

    // Earth & Environment
    case 'challenger-deep-ocean':
    case 'everest-trench-scale':
    case 'ice-melt-sea-level':
    case 'lightning-sun-temp':
    case 'coriolis-equator-storm':
    case 'krakatoa-sound-pressure':
    case 'volcano-ash-aerosols':
    case 'sahara-desert-scale':
    case 'antarctic-lakes-radar':
    case 'australia-drift-gps':
      return <EarthEnvironmentVisuals projectId={projectId} sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;

    // Physics & Chemistry
    case 'gravity-fall-vacuum':
    case 'triple-point-water':
    case 'steel-feather-buoyancy':
    case 'mpemba-hot-water-freeze':
    case 'sound-shatter-glass':
    case 'magnet-copper-pipe':
    case 'light-pressure-solar-sail':
    case 'electricity-signal-electrons':
    case 'air-pressure-can-crush':
    case 'extra-electron-atom':
      return <PhysicsChemistryVisuals projectId={projectId} sceneId={sceneId} title={title} eyebrow={eyebrow} theme={theme} />;
      
    default: return <QuantumTunnelingVisual sceneId={sceneId} title={title} eyebrow={eyebrow} />;
  }
};

export const VideoComposition: React.FC<ProjectData> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scene = props.scenes.find(s => t >= s.start && t <= s.end) || props.scenes[0];
  return (
    <AbsoluteFill style={{ background: '#020005', color: '#f5f9fc' }}>
      <ProjectVisualRouter projectId={props.project_id} sceneId={scene.id} title={scene.title} eyebrow={scene.eyebrow} theme={props.theme} />
      <div style={{ position: 'absolute', bottom: '160px', left: 0, right: 0, height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, pointerEvents: 'none', padding: '0 30px' }}>
        <SubtitleRenderer captions={props.captions} t={t} />
      </div>
      {props.audioPath && <Audio src={staticFile(props.audioPath)} />}
    </AbsoluteFill>
  );
};

const calculateMetadata: CalculateMetadataFunction<ProjectData> = ({ props }) => ({
  fps: props.format?.fps || 30, width: props.format?.width || 1080, height: props.format?.height || 1920,
  durationInFrames: Math.ceil((props.format?.duration || 15) * (props.format?.fps || 30))
});

export const MyComposition = () => {
  const inputProps = getInputProps() as ProjectData;
  const defaultProps: ProjectData = {
    project_id: 'quantum-tunneling-solid-barriers',
    theme: 'physics',
    title: 'QUANTUM TUNNELING',
    eyebrow: 'PHYSICS IMPOSSIBLE',
    format: { width: 1080, height: 1920, fps: 30, duration: 15 },
    scenes: [
      { id: 'scene_1', start: 0, end: 3.0, eyebrow: 'PHYSICS IMPOSSIBLE', title: 'QUANTUM TUNNELING', visual: { type: 'intro' } },
      { id: 'scene_2', start: 3.0, end: 6.5, eyebrow: 'PROBABILITY WAVE', title: 'PARTICLES AS WAVES', visual: { type: 'diagram' } },
      { id: 'scene_3', start: 6.5, end: 10.5, eyebrow: 'INSTANT MATERIALIZATION', title: 'BARRIER PENETRATION', visual: { type: 'simulation' } },
      { id: 'scene_4', start: 10.5, end: 15.0, eyebrow: 'ESSENTIAL FOR LIFE', title: 'POWERING THE SUN', visual: { type: 'summary' } }
    ],
    captions: [
      { start: 0, end: 3.0, text: 'In quantum physics, particles can pass right through solid barriers!' },
      { start: 3.0, end: 6.5, text: 'Subatomic particles behave like probability waves spread across space.' },
      { start: 6.5, end: 10.5, text: 'Because the wave extends past the barrier, the particle can instantly materialize on the other side!' },
      { start: 10.5, end: 15.0, text: 'Without quantum tunneling, nuclear fusion in the Sun would stop, and life would not exist!' }
    ],
    audioPath: ''
  };
  const finalProps = { ...defaultProps, ...inputProps };
  return <Composition id="VisualScience" component={VideoComposition} durationInFrames={Math.ceil(finalProps.format.duration * finalProps.format.fps)} fps={finalProps.format.fps} width={finalProps.format.width} height={finalProps.format.height} calculateMetadata={calculateMetadata} defaultProps={finalProps} />;
};