export type Coord = [number, number];
/**
 * [bottom-left Coord, [width, height]]
 */
export type Rect = [Coord, Coord];
export type Beat = [number, number];
export type NoteIndex = string;
export type SoundIndex = string;
export type LaneIndex = number;
export type TrackIndex = number;

export interface ScoreMetaData {
  title: string;
  artist: string; // TODO: TO BMSMetaData?
  fileName?: string;
  resourcePath?: string;
  extra: Record<string, object>;
}

// pulse and second should be calculated when to use it.
export class NoteTime {
  public beat: Beat;
  public pulse: number;
  public second: number;
  public isFixedTime: boolean; // default: false

  public constructor(pulse: number, isFixedTime: boolean = false) {
    this.beat = [0, 4];
    this.pulse = pulse;
    this.second = 0;
    this.isFixedTime = isFixedTime;
  }
}

export interface NoteLayer {
  index: TrackIndex;
  name: string;
  isLocked: boolean;
  isVisible: boolean;
  editableLaneIndex: LaneIndex[]; // use all if empty
}

export interface TimeSignature {
  measureNo: number;
  meter: Beat;
}

export interface NoteType {
  index: string;
  typeName: string;
  BMSChannel?: number;
}

export interface EventType {
  index: string;
  BMSChannel?: number;
}

export interface MIDIValue {
  length: number; // second scale
  intensity: number; // normalized to 0-1
  pitch: number; // midi scale
}

export interface SoundSprite {
  fileName: string;
  useWhole: boolean; // default true
  interval?: [number, number]; // second scale
}

export interface SoundType {
  index: SoundIndex;
  midiValue?: MIDIValue;
  soundSpriteIndex?: string;
}

// export interface LaneType {
//   noteType: NoteType,
// };

export enum EditMode {
  TIME_SELECT_MODE,
  SELECT_MODE,
  WRITE_MODE,
}

export class NoteProps {
  public propType: 'm' | 'e' = 'm';
  public laneIndex: LaneIndex; // Position X
  public trackIndex: TrackIndex;
  public lnPrevPart: NoteIndex | null;
  public lnNextPart: NoteIndex | null;

  public constructor() {
    this.laneIndex = 0;
    this.trackIndex = 0;
    this.lnPrevPart = null;
    this.lnNextPart = null;
  }
}

export class Note {
  public index: NoteIndex;
  public time: NoteTime; // Y Position
  public isLocked: boolean;

  public constructor(index: NoteIndex, time: NoteTime) {
    this.index = index;
    this.time = time;
    this.isLocked = false;
  }
}

export class PlayNote extends Note {
  public isBackground: boolean;
  // DO NOT MANIPULATE IT! props are used as euclase core properties only
  public props: NoteProps;
  // this extra value is for users
  public extra: Record<string, object>;

  public constructor(indexNo: number, time: NoteTime, props: NoteProps) {
    super(`${props.propType}${indexNo}`, time);
    this.isBackground = false;
    this.props = props;
    this.extra = {};
  }
}

export class BPMNote extends Note {
  public bpm: number;

  public constructor(indexNo: number, pulse: number, bpm: number) {
    super(`b${indexNo}`, new NoteTime(pulse));
    this.bpm = bpm;
    this.isLocked = false;
  }
}

export class StopNote extends Note {
  public duration: NoteTime;

  public constructor(
    indexNo: number,
    positionPulse: number,
    durationPulse: number,
  ) {
    super(`s${indexNo}`, new NoteTime(positionPulse));
    this.duration = new NoteTime(durationPulse);
    this.isLocked = false;
  }
}

// time is always fixed by pulse
export type ScoreNote = BPMNote | StopNote;
