#!/usr/bin/env swift

import AVFoundation
import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

enum SpriteBuildError: LocalizedError {
  case invalidArguments
  case invalidDuration
  case contextCreationFailed
  case destinationCreationFailed
  case destinationFinalizeFailed

  var errorDescription: String? {
    switch self {
    case .invalidArguments:
      return "Usage: build-cursor-sprite.swift <input-video> <output-png>"
    case .invalidDuration:
      return "The source video has no readable duration."
    case .contextCreationFailed:
      return "Could not create the sprite-sheet drawing context."
    case .destinationCreationFailed:
      return "Could not create the PNG destination."
    case .destinationFinalizeFailed:
      return "Could not finish writing the PNG sprite sheet."
    }
  }
}

let columns = 11
let rows = 10
let frameCount = columns * rows
let cellSize = 256
let sheetWidth = columns * cellSize
let sheetHeight = rows * cellSize

guard CommandLine.arguments.count == 3 else {
  throw SpriteBuildError.invalidArguments
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
let asset = AVURLAsset(url: inputURL)
let duration = try await asset.load(.duration)
let durationSeconds = duration.seconds

guard durationSeconds.isFinite, durationSeconds > 0 else {
  throw SpriteBuildError.invalidDuration
}

let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
guard let context = CGContext(
  data: nil,
  width: sheetWidth,
  height: sheetHeight,
  bitsPerComponent: 8,
  bytesPerRow: 0,
  space: colorSpace,
  bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
) else {
  throw SpriteBuildError.contextCreationFailed
}

context.setFillColor(CGColor(gray: 1, alpha: 1))
context.fill(CGRect(x: 0, y: 0, width: sheetWidth, height: sheetHeight))

let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.maximumSize = CGSize(width: cellSize, height: cellSize)
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero

for frameIndex in 0..<frameCount {
  let progress = Double(frameIndex) / Double(frameCount)
  let requestedTime = CMTime(seconds: durationSeconds * progress, preferredTimescale: 600)
  let frame = try generator.copyCGImage(at: requestedTime, actualTime: nil)
  let column = frameIndex % columns
  let row = frameIndex / columns
  let targetRect = CGRect(
    x: column * cellSize,
    y: sheetHeight - ((row + 1) * cellSize),
    width: cellSize,
    height: cellSize
  )

  context.interpolationQuality = .high
  context.draw(frame, in: targetRect)

  if frameIndex == 0 || (frameIndex + 1).isMultiple(of: columns) {
    print("Rendered frame \(frameIndex + 1)/\(frameCount)")
  }
}

guard let spriteSheet = context.makeImage() else {
  throw SpriteBuildError.contextCreationFailed
}

try FileManager.default.createDirectory(
  at: outputURL.deletingLastPathComponent(),
  withIntermediateDirectories: true
)

guard let destination = CGImageDestinationCreateWithURL(
  outputURL as CFURL,
  UTType.png.identifier as CFString,
  1,
  nil
) else {
  throw SpriteBuildError.destinationCreationFailed
}

CGImageDestinationAddImage(destination, spriteSheet, nil)

guard CGImageDestinationFinalize(destination) else {
  throw SpriteBuildError.destinationFinalizeFailed
}

print("Wrote \(frameCount) frames to \(outputURL.path)")
