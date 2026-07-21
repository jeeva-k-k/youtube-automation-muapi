import AVFoundation
import AudioToolbox
import Foundation

struct NoteEvent {
    let time: Double
    let instrument: Int
    let note: UInt8
    let velocity: UInt8
    let isOn: Bool
}

let outputURL = URL(fileURLWithPath: CommandLine.arguments.count > 1
    ? CommandLine.arguments[1]
    : "orchestral-ending-layer.wav")
let soundBankURL = URL(fileURLWithPath: "/System/Library/Components/CoreAudio.component/Contents/Resources/gs_instruments.dls")
let sampleRate = 48_000.0
let duration = 272.0
let beat = 60.0 / 160.0
let bar = beat * 4.0
let firstDownbeat = 0.16125

let engine = AVAudioEngine()
let orchestraBus = AVAudioMixerNode()
let reverb = AVAudioUnitReverb()
reverb.loadFactoryPreset(.mediumHall3)
reverb.wetDryMix = 18

engine.attach(orchestraBus)
engine.attach(reverb)

let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 2)!
let samplers = (0..<6).map { _ in AVAudioUnitSampler() }
for sampler in samplers {
    engine.attach(sampler)
    engine.connect(sampler, to: orchestraBus, format: format)
}
engine.connect(orchestraBus, to: reverb, format: format)
engine.connect(reverb, to: engine.mainMixerNode, format: format)

let melodicMSB = UInt8(kAUSampler_DefaultMelodicBankMSB)
let percussionMSB = UInt8(kAUSampler_DefaultPercussionBankMSB)
try samplers[0].loadSoundBankInstrument(at: soundBankURL, program: 45, bankMSB: melodicMSB, bankLSB: 0) // pizzicato strings
try samplers[1].loadSoundBankInstrument(at: soundBankURL, program: 48, bankMSB: melodicMSB, bankLSB: 0) // string ensemble
try samplers[2].loadSoundBankInstrument(at: soundBankURL, program: 61, bankMSB: melodicMSB, bankLSB: 0) // brass section
try samplers[3].loadSoundBankInstrument(at: soundBankURL, program: 9, bankMSB: melodicMSB, bankLSB: 0)  // glockenspiel
try samplers[4].loadSoundBankInstrument(at: soundBankURL, program: 73, bankMSB: melodicMSB, bankLSB: 0) // flute
try samplers[5].loadSoundBankInstrument(at: soundBankURL, program: 0, bankMSB: percussionMSB, bankLSB: 0) // percussion

samplers[0].masterGain = -12
samplers[1].masterGain = -17
samplers[2].masterGain = -17
samplers[3].masterGain = -14
samplers[4].masterGain = -17
samplers[5].masterGain = -18
orchestraBus.outputVolume = 0.78

var events: [NoteEvent] = []
func note(_ instrument: Int, _ midi: UInt8, _ start: Double, _ length: Double, _ velocity: UInt8) {
    events.append(NoteEvent(time: start, instrument: instrument, note: midi, velocity: velocity, isOn: true))
    events.append(NoteEvent(time: start + length, instrument: instrument, note: midi, velocity: 0, isOn: false))
}

// Full-song celebratory pulse. Short notes preserve the bounce and leave room for vocals.
for barIndex in 0..<179 {
    let start = firstDownbeat + Double(barIndex) * bar
    let positionInSection = barIndex % 16
    let isLift = positionInSection >= 8
    let isFinale = barIndex >= 163
    let pizzVelocity = UInt8(isFinale ? 72 : (isLift ? 49 : 39))

    // Pizzicato call-and-response on beats and offbeats, using neutral F-C fifths.
    note(0, 65, start + 0.0 * beat, beat * 0.38, pizzVelocity)      // F4
    note(0, 72, start + 1.5 * beat, beat * 0.30, pizzVelocity - 5) // C5
    note(0, 77, start + 2.0 * beat, beat * 0.38, pizzVelocity + 2) // F5
    note(0, 72, start + 3.5 * beat, beat * 0.28, pizzVelocity - 4) // C5

    // Tambourine eighths and a light clap on beats 2 and 4 reinforce the existing groove.
    for eighth in 0..<8 {
        note(5, 54, start + Double(eighth) * beat / 2.0, 0.06, UInt8(isFinale ? 45 : 27 + eighth % 2 * 5))
    }
    note(5, 39, start + beat, 0.08, UInt8(isFinale ? 55 : 34))
    note(5, 39, start + 3.0 * beat, 0.08, UInt8(isFinale ? 59 : 37))

    // Bright string and brass accents appear in the second half of each 16-bar cycle.
    if isLift && barIndex % 2 == 0 {
        note(1, 65, start, beat * 0.72, UInt8(isFinale ? 69 : 39))
        note(1, 72, start, beat * 0.72, UInt8(isFinale ? 61 : 34))
        note(2, 53, start + 2.0 * beat, beat * 0.58, UInt8(isFinale ? 72 : 42))
        note(2, 60, start + 2.0 * beat, beat * 0.58, UInt8(isFinale ? 64 : 36))
    }

    // Glockenspiel/flute sparkles mark phrases rather than filling every gap.
    if barIndex % 8 == 0 {
        note(3, 77, start, beat * 0.75, UInt8(isFinale ? 74 : 49))
        note(3, 84, start + beat, beat * 0.65, UInt8(isFinale ? 68 : 43))
        note(4, 77, start + 2.0 * beat, beat * 0.9, UInt8(isFinale ? 66 : 38))
        note(4, 84, start + 3.0 * beat, beat * 0.82, UInt8(isFinale ? 60 : 34))
    }
}

// A bright high-string lift over the final sixteen bars—no low drone or choir.
let finaleStart = firstDownbeat + 163.0 * bar
for phrase in 0..<4 {
    let start = finaleStart + Double(phrase) * 4.0 * bar
    let length = 4.0 * bar - 0.06
    note(1, 65, start, length, UInt8(44 + phrase * 8))
    note(1, 72, start, length, UInt8(38 + phrase * 8))
    note(1, 77, start, length, UInt8(42 + phrase * 8))
}

// Celebratory cymbal blooms at the finale entrance and source ending.
note(5, 49, finaleStart, 2.2, 70)
note(5, 57, finaleStart + 8.0 * bar, 2.0, 76)
note(5, 49, finaleStart + 16.0 * bar - 0.10, 3.0, 104)
note(5, 57, finaleStart + 16.0 * bar - 0.08, 2.8, 88)
note(3, 77, finaleStart + 16.0 * bar - 0.10, 3.2, 90)
note(3, 84, finaleStart + 16.0 * bar - 0.08, 3.0, 82)

events.sort { lhs, rhs in
    if lhs.time == rhs.time { return !lhs.isOn && rhs.isOn }
    return lhs.time < rhs.time
}

try engine.enableManualRenderingMode(.offline, format: format, maximumFrameCount: 512)
try engine.start()

let output = try AVAudioFile(forWriting: outputURL, settings: format.settings)
let totalFrames = AVAudioFramePosition(duration * sampleRate)
var rendered: AVAudioFramePosition = 0
var eventIndex = 0

while rendered < totalFrames {
    let currentTime = Double(rendered) / sampleRate
    while eventIndex < events.count && events[eventIndex].time <= currentTime + 0.000_001 {
        let event = events[eventIndex]
        if event.isOn {
            samplers[event.instrument].startNote(event.note, withVelocity: event.velocity, onChannel: 0)
        } else {
            samplers[event.instrument].stopNote(event.note, onChannel: 0)
        }
        eventIndex += 1
    }

    let remaining = totalFrames - rendered
    let frames = AVAudioFrameCount(min(Int64(512), remaining))
    let buffer = AVAudioPCMBuffer(pcmFormat: engine.manualRenderingFormat, frameCapacity: frames)!
    let status = try engine.renderOffline(frames, to: buffer)
    if status == .success {
        try output.write(from: buffer)
        rendered += AVAudioFramePosition(buffer.frameLength)
    } else if status == .cannotDoInCurrentContext {
        continue
    } else {
        throw NSError(domain: "OrchestralRenderer", code: Int(status.rawValue), userInfo: [NSLocalizedDescriptionKey: "Offline rendering failed with status \(status)"])
    }
}

engine.stop()
print(outputURL.path)
