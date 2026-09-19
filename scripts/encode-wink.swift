import AVFoundation
import Foundation

// Offline macOS asset preparation only. Vercel serves the checked-in MP4.
guard CommandLine.arguments.count == 5 else {
    print("Usage: encode-wink <source.mp4> <new-output.mp4> <square-pixels> <bits-per-second>")
    exit(1)
}

let source = URL(fileURLWithPath: CommandLine.arguments[1])
let destination = URL(fileURLWithPath: CommandLine.arguments[2])
let dimension = Int(CommandLine.arguments[3])!
let bitrate = Int(CommandLine.arguments[4])!
let asset = AVURLAsset(url: source)
let track = asset.tracks(withMediaType: .video)[0]
let reader = try AVAssetReader(asset: asset)
let output = AVAssetReaderVideoCompositionOutput(videoTracks: [track], videoSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange])
let composition = AVMutableVideoComposition()
composition.renderSize = CGSize(width: dimension, height: dimension)
composition.frameDuration = CMTime(value: 1, timescale: 30)
let instruction = AVMutableVideoCompositionInstruction()
instruction.timeRange = CMTimeRange(start: .zero, duration: asset.duration)
let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: track)
layer.setTransform(track.preferredTransform.concatenating(CGAffineTransform(scaleX: CGFloat(dimension) / track.naturalSize.width, y: CGFloat(dimension) / track.naturalSize.height)), at: .zero)
instruction.layerInstructions = [layer]
composition.instructions = [instruction]
output.videoComposition = composition
reader.add(output)
let writer = try AVAssetWriter(outputURL: destination, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: dimension,
    AVVideoHeightKey: dimension,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: bitrate,
        AVVideoExpectedSourceFrameRateKey: 30,
        AVVideoMaxKeyFrameIntervalKey: 60,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoAllowFrameReorderingKey: true
    ]
])
input.expectsMediaDataInRealTime = false
writer.add(input)
guard writer.startWriting(), reader.startReading() else { fatalError("Could not start media conversion") }
writer.startSession(atSourceTime: .zero)
var frames = 0
while reader.status == .reading {
    if !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.002); continue }
    guard let sample = output.copyNextSampleBuffer() else { break }
    guard input.append(sample) else { fatalError("Encoding failed: \(String(describing: writer.error))") }
    frames += 1
}
if reader.status == .failed { fatalError("Decoding failed: \(String(describing: reader.error))") }
input.markAsFinished()
let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
guard writer.status == .completed else { fatalError("Writer failed: \(String(describing: writer.error))") }
print("Encoded \(frames) frames at \(dimension) square, target \(bitrate) bits/s")
