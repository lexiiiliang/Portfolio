import AVFoundation
import ImageIO
import Foundation
import UniformTypeIdentifiers

// Offline macOS preparation only. Passthrough preserves the encoded tracks;
// the network-optimized MP4 and first-frame poster are committed for deployment.
guard CommandLine.arguments.count == 4 else {
    fatalError("Usage: prepare-livis-video source.mp4 output.mp4 poster.png")
}
let asset = AVURLAsset(url: URL(fileURLWithPath: CommandLine.arguments[1]))
let track = asset.tracks(withMediaType: .video)[0]
let size = track.naturalSize.applying(track.preferredTransform)
let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero
let frame = try generator.copyCGImage(at: .zero, actualTime: nil)
let posterURL = URL(fileURLWithPath: CommandLine.arguments[3])
guard let image = CGImageDestinationCreateWithURL(posterURL as CFURL, UTType.png.identifier as CFString, 1, nil) else {
    fatalError("Could not create poster")
}
CGImageDestinationAddImage(image, frame, nil)
guard CGImageDestinationFinalize(image) else { fatalError("Could not write poster") }

guard let export = AVAssetExportSession(asset: asset, presetName: AVAssetExportPresetPassthrough) else {
    fatalError("Could not create passthrough export")
}
export.outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
export.outputFileType = .mp4
export.shouldOptimizeForNetworkUse = true
let done = DispatchSemaphore(value: 0)
export.exportAsynchronously { done.signal() }
done.wait()
guard export.status == .completed else { fatalError("Export failed: \(String(describing: export.error))") }
print("{\"width\":\(Int(abs(size.width))),\"height\":\(Int(abs(size.height))),\"duration\":\(asset.duration.seconds)}")
