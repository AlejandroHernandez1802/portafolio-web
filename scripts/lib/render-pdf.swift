// Renders PDF pages to PNG with macOS PDFKit (vector-sharp at any scale; sharp's prebuilt
// libvips has no PDF reader). Called by capture-screens.mjs for the MRB brochure (R-04).
// Usage: swift scripts/lib/render-pdf.swift <file.pdf> <out-prefix> <scale> <page>...
// Writes <out-prefix>-<page>.png for each 1-based page, on a white background.

import AppKit
import Foundation
import PDFKit

let args = CommandLine.arguments
guard args.count >= 5, let scale = Double(args[3]), let doc = PDFDocument(url: URL(fileURLWithPath: args[1])) else {
  FileHandle.standardError.write("usage: render-pdf.swift <file.pdf> <out-prefix> <scale> <page>...\n".data(using: .utf8)!)
  exit(1)
}

for pageArg in args[4...] {
  guard let number = Int(pageArg), let page = doc.page(at: number - 1) else {
    FileHandle.standardError.write("no page \(pageArg)\n".data(using: .utf8)!)
    exit(1)
  }
  let box = page.bounds(for: .mediaBox)
  let width = Int((box.width * scale).rounded()), height = Int((box.height * scale).rounded())
  guard let ctx = CGContext(
    data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: 0,
    space: CGColorSpace(name: CGColorSpace.sRGB)!,
    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
  ) else { exit(1) }
  ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
  ctx.fill(CGRect(x: 0, y: 0, width: width, height: height))
  ctx.scaleBy(x: scale, y: scale)
  page.draw(with: .mediaBox, to: ctx)
  let png = NSBitmapImageRep(cgImage: ctx.makeImage()!).representation(using: .png, properties: [:])!
  try png.write(to: URL(fileURLWithPath: "\(args[2])-\(number).png"))
}
