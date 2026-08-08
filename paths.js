/* Generated from PATHS.md — the ten-path curriculum data.
   Lessons are STUBS: id, title, tier only. Each lesson's read/questions/
   exercises/connection/figure/goDeeper are added one at a time as they are
   authored (see CLAUDE.md "THE REBUILD" and PATHS.md "Authoring order").
   An unauthored lesson (no `read` field) renders as "not written yet" in
   the app rather than crashing — see lessonWritten() in app.js.
   Regenerate the stub shell with the parser documented in PATHS.md's git
   history if PATHS.md itself changes; do not hand-edit titles here without
   also updating PATHS.md, since PATHS.md is the source of truth. */
const PATHS = {
 "paths": [
  {
   "id": "p0",
   "name": "Computer Systems",
   "purpose": "Build the mental model every later topic rests on. Not electrical-engineering depth — enough to explain where instructions and data live, and how a program becomes running work.",
   "questions": [
    "What data is represented in memory?",
    "Which operations happen in the CPU, registers, cache?",
    "What changes if the data layout or access pattern changes?",
    "Can I predict the program state before running it?"
   ],
   "chapters": [
    {
     "id": "p0a",
     "name": "Data representation",
     "lessons": [
      {
       "id": "p0a-01",
       "title": "Bits and bytes",
       "tier": "EXEC",
       "read": "1. Start at the bottom: computers need physical states\n\nWhen we write software, we deal with abstractions:\n\n```text\nlet age = 27\nlet isLoggedIn = true\nlet name = \"Hadi\"\n```\n\nA processor cannot directly manipulate `27`, `true`, or `\"Hadi\"` as abstract ideas. Eventually, those ideas must be represented physically. A computer is an electronic machine. At the lowest level, its hardware can distinguish between physical states \u2014 different voltage levels, stored electrical charge(positive/Negative), transistor states, magnetic orientation, or other physical mechanisms, depending on the technology. The exact physical implementation depends on the hardware. The important idea is that the machine can reliably distinguish between two states. We represent those two states symbolically as `0` and `1`. This is where the bit begins.\n\nA bit is short for `binary digit`. It has exactly two possible states, `0` and `1`, these are symbols we use to describe the two states; the actual computer stores some physical state that represents them. So bits are not merely mathematical ideas floating around inside the computer \u2014 information must be encoded into physical hardware.\n\n2. Combining bits into patterns\n\nOne bit distinguishes between two possibilities, so it is enough to store whether a light is on: `0` \u2192 off, `1` \u2192 on. But suppose you want four possibilities \u2014 `red`, `green`, `blue`, `yellow`. One bit cannot do that; it only gives you `0` and `1`, two patterns. So we combine bits. With two bits, the possible patterns are `00`, `01`, `10`, `11` \u2014 four possibilities, because the first bit has two possible states and the second bit also has two possible states, so `2 \u00d7 2 = 4`. With three bits, `2 \u00d7 2 \u00d7 2 = 8`. Generally, `n bits \u2192 2\u207f possible patterns`. This relationship is one of the most important ideas in computer science.\n\n3. The byte: eight bits, 256 patterns, and the range 0\u2013255\n\nA byte is a group of `8 bits` \u2014 exactly, `1 byte = 8 bits`. For example, this is one byte: `0 1 0 1 1 0 1 0`. There is nothing in the laws of physics saying computers must group bits into groups of eight \u2014 the size of a byte is a computing convention, and historically different architectures used different byte sizes. Over time, the industry converged on `1 byte = 8 bits`, and today an eight-bit byte is effectively universal: modern programming languages, operating systems, file formats, networking systems, and processors generally assume it. Every example in this course does too.\n\nApplying `n bits \u2192 2\u207f possible patterns` to a byte's eight bits gives `2\u2078 = 256`: a byte has 256 distinct bit patterns. Notice carefully \u2014 a byte does not contain 256 bits, it contains `8 bits`, and those eight bits can be arranged into 256 different patterns, from all zeros to all ones:\n\n```text\n00000000\n00000001\n00000010\n00000011\n...\n11111111\n```\n\nInterpreted as non-negative integers, those 256 patterns represent `0`, `1`, `2`, and so on. Counting from zero gives `0 through 255`, because `0...255` contains exactly 256 numbers \u2014 verify with `255 - 0 + 1 = 256`. This is the range of an unsigned eight-bit integer, `UInt8`: `UInt8 range = 0...255`. We are not discussing negative integers yet \u2014 signed integers and two's complement deserve their own lesson.\n\n4. The nibble\n\nThere is another smaller unit you will occasionally encounter: the nibble. A nibble is `4 bits`. Therefore `1 nibble = 4 bits`, `1 byte = 8 bits`, `1 byte = 2 nibbles`. For example, `1011 0110` can be visually separated into two nibbles:\n\n```text\n1011 0110\n^^^^ ^^^^\n4 bits  4 bits\n```\n\nWhy bother naming four bits? One major reason is hexadecimal. Later you will learn that `1 hexadecimal digit \u2194 4 bits`, so nibbles become convenient when reading things like `0xAF`, `0x12`, `0xFF`. We will not learn hexadecimal yet. For now, plant the relationship in your head: `bit` = 1 binary digit, `nibble` = 4 bits, `byte` = 8 bits.\n\n5. Bit positions and place value\n\nConsider this byte: `1 0 1 0 1 1 0 1`. Bits are usually numbered starting from zero:\n\n```text\nbit 7         bit 0\n  \u2193             \u2193\n  1 0 1 0 1 1 0 1\n```\n\nSo the bit positions are `7 6 5 4 3 2 1 0`. The rightmost bit, `bit 0`, is the least significant bit, or LSB. The leftmost bit, `bit 7`, is the most significant bit, or MSB. Each position corresponds to a power of two:\n\n```text\nBit position: 7   6   5   4   3   2   1   0\nValue:        128 64  32  16  8   4   2   1\n```\n\nThese values come from `2\u2077 = 128` down to `2\u2070 = 1`. We are not doing a full binary-number lesson yet, but understanding the positions will help later when we learn binary conversion, bit shifting, bit masks, flags, permissions, networking protocols, graphics, and low-level APIs. For now, just understand what the positions mean.\n\n6. Worked example: decoding the byte 173\n\nConsider `173`. We can construct it from powers of two by marking which bit positions we need:\n\n```text\n128 64 32 16 8 4 2 1\n 1   0  1  0 1 1 0 1\n```\n\nSo `173 = 128 + 32 + 8 + 4 + 1`, which is `10101101` in binary. Recover it by summing each marked position: `128 + 32 + 8 + 4 + 1 = 173`. Don't worry about becoming fast at binary conversion yet \u2014 the goal here is simply to see that the individual bit positions have meaning.\n\n7. Byte-addressable memory\n\nWhy do programmers talk about bytes so much, when computers ultimately use bits? Because software and hardware need convenient chunks to work with. Modern mainstream computer memory is normally byte-addressable \u2014 an ordinary memory address identifies one byte. Imagine memory like a gigantic row of byte-sized boxes:\n\n```text\nAddress    Contents\n0x1000  \u2192  10101101\n0x1001  \u2192  00110110\n0x1002  \u2192  11110000\n0x1003  \u2192  00001111\n```\n\nEach address selects one byte, and the next address selects the next byte \u2014 `0x1000`, `0x1001`, `0x1002`, `0x1003` represent neighboring byte locations.\n\nImagine instead that every bit had its own address: `address 100` \u2192 one bit, `address 101` \u2192 one bit, `address 102` \u2192 one bit, and so on. This would make many normal memory operations much more awkward. Processors usually want to move and operate on groups of bits \u2014 `8 bits`, `16 bits`, `32 bits`, `64 bits`, `128 bits` \u2014 not a single isolated bit, which is often too small a unit for general-purpose storage and computation. So modern systems expose byte-sized addressable units. When software wants a particular bit, it accesses the containing byte or larger value, then isolates the desired bit \u2014 bit masks and bitwise operators will show exactly how that works, later.\n\nBe careful with the statement \"memory is addressed in bytes,\" though. For modern systems like Apple's platforms, that is a useful and correct mental model, but byte-addressability is not a fundamental law of computing \u2014 different computer architectures can theoretically choose different addressable units, and historically, some did. The precise statement is: modern mainstream architectures, including current Apple platforms, use byte-addressable memory. That distinction matters because we want to understand why systems are designed this way, rather than memorize conventions as if physics required them.\n\n8. Measuring size in Swift: MemoryLayout\n\nSwift constantly exposes sizes in bytes. Consider `MemoryLayout<UInt8>.size`. You might guess it means \"tell me how many bits UInt8 uses\" \u2014 it does not. The result is measured in bytes:\n\n```text\nprint(MemoryLayout<UInt8>.size)\n// prints: 1, because UInt8 = 8 bits = 1 byte\n```\n\nSwift provides integer types whose width is explicitly part of their name: `UInt8`, `UInt16`, `UInt32`, `UInt64`. The number tells you the number of bits:\n\n```text\nType     Bits  Bytes\nUInt8    8     1\nUInt16   16    2\nUInt32   32    4\nUInt64   64    8\n```\n\nbecause `8 bits = 1 byte`, so `16 / 8 = 2 bytes`, `32 / 8 = 4 bytes`, `64 / 8 = 8 bytes`. You can confirm the whole family at once:\n\n```text\nprint(MemoryLayout<UInt8>.size)   // 1\nprint(MemoryLayout<UInt16>.size)  // 2\nprint(MemoryLayout<UInt32>.size)  // 4\nprint(MemoryLayout<UInt64>.size)  // 8\n```\n\nAgain: these values are bytes, not bits. So `MemoryLayout<UInt32>.size == 4` means 4 bytes, which equals 32 bits.\n\n9. The type controls the width, not the value\n\nConsider:\n\n```text\nlet a: UInt8 = 1\nlet b: UInt64 = 1\n```\n\nBoth variables currently contain the mathematical value `1`, but they do not have the same width. `a` is `UInt8`, so its representation requires 8 bits (1 byte). `b` is `UInt64`, so its representation requires 64 bits (8 bytes) \u2014 even though the value itself is tiny. The value determines what information is currently stored; the type determines how that information is represented and interpreted. `UInt64(1)` does not shrink itself down to one bit just because the number 1 could theoretically be expressed with one binary digit \u2014 its type is still `UInt64`.\n\nWhy would Swift reserve 64 bits for a value that currently contains 1? Because fixed representations make computation predictable. A processor needs to know how many bytes to read, how many bytes to write, what operations apply, where the next value begins, and what range is available. Imagine if every integer dynamically used only the minimum number of bits necessary: `1` might require one bit, `255` might require eight bits, and `100000000000` would require far more, so the location and representation of every value could constantly change as the value changed. Fixed-width types avoid that complexity.\n\n10. Int and UInt on 64-bit platforms\n\nSwift also has `Int` and `UInt`. Unlike `UInt32` or `UInt64`, the number of bits is not written in the type name. On current 64-bit Apple platforms, `Int` and `UInt` are both 8 bytes, because they are 64-bit integer types on these systems. You can confirm it:\n\n```text\nprint(MemoryLayout<Int>.size)   // 8\nprint(MemoryLayout<UInt>.size)  // 8\n```\n\nHistorically, this depended on the architecture. `Int` is a machine-sized integer type, not one that conceptually always means exactly 64 bits on every computer ever built.\n\n11. The Bool surprise: information versus storage\n\nA Boolean has only two logical possibilities, `false` and `true`. Information-theoretically, two possibilities can be represented by one bit (`0`, `1`), so you might predict that `MemoryLayout<Bool>.size` would somehow report \"1 bit.\" But `MemoryLayout.size` reports bytes:\n\n```text\nprint(MemoryLayout<Bool>.size)  // 1, meaning 1 byte \u2014 not one bit\n```\n\nA Boolean needs only 2 possible states, which mathematically requires 1 bit of information \u2014 but Swift's standalone `Bool` value occupies 1 byte of storage representation. The minimum information required to express something is not necessarily equal to the amount of storage a language or machine uses to represent it. This principle appears everywhere in systems programming: efficiency is often balanced against ease of addressing, alignment, performance, processor architecture, and implementation simplicity. We will revisit these ideas later.\n\n12. What MemoryLayout.size does NOT mean\n\nBe careful not to misunderstand `MemoryLayout<T>.size` as \"tell me the total amount of RAM this thing and everything connected to it consumes.\" For simple fixed-width value types the interpretation is straightforward \u2014 `MemoryLayout<UInt64>.size` is clearly eight bytes. But things become more complicated with types such as `String`, `Array`, `Dictionary`, and class instances, because these can reference additional storage elsewhere. For example, `let names = [\"A\", \"B\", \"C\", \"D\"]` \u2014 the array value itself has some representation, but its elements may involve additional storage. So `MemoryLayout.size(ofValue: names)` does not mean \"tell me the complete amount of memory used by the entire array and everything associated with it.\" We will learn those distinctions later when we study stack and heap, pointers, reference types, allocations, value types, and copy-on-write. For this lesson, just remember: `MemoryLayout<T>.size` measures the size of `T`'s value representation, in bytes.\n\n13. Notation: b versus B, and kB versus KiB\n\nThere is a small notation rule that causes a lot of confusion: lowercase `b` means bits, uppercase `B` means bytes. So `Mb` means megabits, while `MB` means megabytes \u2014 these are not the same. Because `8 bits = 1 byte`, `8 megabits \u2248 1 megabyte`, depending on exactly which decimal/binary convention is being used. This shows up constantly with network speeds: an internet connection advertised as `100 Mbps` means 100 megabits per second, not 100 megabytes per second. Ignoring network overhead, divide by eight to get approximately `12.5 MB/s` \u2014 one reason a \"100 Mbps\" connection does not usually download a 100 MB file in one second.\n\nA related confusion: you may have learned `1 KB = 1024 bytes`, but the modern standardized terminology distinguishes decimal and binary prefixes:\n\n```text\ndecimal                  binary\n1 kB = 1,000 bytes       1 KiB = 1,024 bytes\n1 MB = 1,000,000 bytes   1 MiB = 1,048,576 bytes\n1 GB = 1,000,000,000 B   1 GiB = 1,073,741,824 bytes\n```\n\nThe `i` matters: `kB` \u2192 kilobyte, `KiB` \u2192 kibibyte, `MB` \u2192 megabyte, `MiB` \u2192 mebibyte. Why 1024? Because `1024 = 2\u00b9\u2070`, which fits naturally into binary systems. Why 1000? Because the SI prefix `kilo` means 1000 in the metric system. Historically, people often used `KB` to mean 1024 bytes, and even today software sometimes uses the terms inconsistently \u2014 so when precision matters, write `kB = 1000 bytes` and `KiB = 1024 bytes`. This becomes particularly important when you calculate storage, image buffers, downloads, memory budgets, and caches \u2014 files, memory, downloads, and network payloads are all measured in bytes, even though the bit is the more fundamental unit.\n\n14. A real byte budget: images\n\nLet's connect this directly to iOS. Imagine an image that is `1920 \u00d7 1080` pixels, with each pixel represented using four bytes: 1 for red, 1 for green, 1 for blue, 1 for alpha \u2014 commonly described as RGBA, so `1 pixel = 4 bytes`. The number of pixels is `1920 \u00d7 1080 = 2,073,600`, so the raw pixel bytes are `2,073,600 \u00d7 4 = 8,294,400 bytes` \u2014 approximately `8.29 MB` in decimal megabytes, or `8,294,400 / 1,048,576 \u2248 7.91 MiB`. So one raw 1080p RGBA image requires roughly 7.91 MiB of pixel storage.\n\nThis often surprises developers: you might have a JPEG file that is only `600 kB` on disk, then load it into an app and see it use several megabytes in memory. That's because the JPEG file is compressed \u2014 it contains a compact encoding of the image, and when the image is decoded for display, the system needs a raw pixel buffer. So compressed JPEG \u2192 decoding \u2192 raw pixels, and disk size \u2260 raw pixel size. This is extremely important in image-heavy apps.\n\nThe gap grows fast. Consider `3840 \u00d7 2160` pixels (4K) \u2014 total pixels `8,294,400`, and at four bytes per pixel that's `33,177,600 bytes`, or `\u2248 31.64 MiB`. Now imagine a scrolling feed holding ten such decoded images \u2014 ignoring every other detail, that could theoretically approach `316 MiB` just for those raw buffers. Suddenly, concepts such as image caching, image resizing, downsampling, reuse, lazy loading, and memory warnings begin to make much more sense. The low-level concept of the byte has reached all the way up to an iOS performance problem.\n\n15. Data in Swift, and the chain all the way down\n\nSwift and Foundation frequently expose raw data using `Data`. For example, a network request might return `Data`, and you can ask `data.count`, which represents bytes. If `data.count == 5_000_000`, the `Data` contains approximately 5 MB using decimal units. So when you work with HTTP responses, images, JSON payloads, downloaded files, uploads, and local caches, you are constantly working with byte counts whether you consciously think about it or not.\n\nYou should now be able to mentally trace the whole chain, from the physical machine up to the code you write:\n\n```text\nphysical hardware state\n  \u2192 bit\n  \u2192 4 bits = nibble\n  \u2192 8 bits = byte\n  \u2192 256 possible byte patterns\n  \u2192 byte-addressable memory\n  \u2192 fixed-width types (Swift MemoryLayout)\n  \u2192 Data / images / files / network payloads\n  \u2192 real iOS memory and performance behavior\n```\n\nInstead of memorizing that `MemoryLayout<UInt64>.size == 8`, you should eventually be able to explain why the number 8 makes sense all the way down to the representation model of the machine.",
       "points": [
        {
         "t": "Bit versus byte",
         "d": "1 bit = one binary state. 1 byte = 8 bits."
        },
        {
         "t": "Eight bits versus 256 values",
         "d": "A byte contains 8 bits. 8 bits can form 2⁸ = 256 different patterns."
        },
        {
         "t": "Logical information versus physical representation",
         "d": "A Boolean has 2 logical possibilities. A Swift Bool occupies 1 byte as a value representation."
        },
        {
         "t": "Value versus type width",
         "d": "UInt64(1) contains the number 1. Its UInt64 type keeps the width at 64 bits = 8 bytes."
        },
        {
         "t": "b versus B",
         "d": "b = bit. B = byte. 8 Mb ≠ 8 MB."
        },
        {
         "t": "MB versus MiB",
         "d": "1 MB = 1,000,000 bytes. 1 MiB = 1,048,576 bytes."
        }
       ],
       "connection": {
        "down": "The CPU works with collections of these bits and bytes using registers, instructions, caches, memory buses, and other hardware structures.",
        "up": "All of those questions connect back to the concepts in this lesson."
       },
       "questions": [
        {
         "type": "recall",
         "prompt": "Without looking back at the lesson, define `bit`, `nibble`, and `byte` in your own words, and state the exact relationship between them.",
         "answer": "A bit is a binary unit with two possible states, conventionally represented as 0 and 1. A nibble is 4 bits. A byte is 8 bits, so a byte is also two nibbles.\n\n1 nibble = 4 bits\n1 byte = 8 bits = 2 nibbles"
        },
        {
         "type": "trace",
         "prompt": "Before running this code, predict every output value and the unit it is measured in.",
         "answer": "Expected:\n1\n2\n1\n8\n\nThe unit is bytes.\n\nUInt8 → 1 byte\nUInt16 → 2 bytes\nBool → 1 byte\nUInt64 → 8 bytes",
         "code": "print(MemoryLayout<UInt8>.size)\nprint(MemoryLayout<UInt16>.size)\nprint(MemoryLayout<Bool>.size)\nprint(MemoryLayout<UInt64>.size)"
        },
        {
         "type": "reasoning",
         "prompt": "Why do modern computers normally give memory addresses to bytes rather than to individual bits? What would change if every bit had its own address?",
         "answer": "Processors and software usually manipulate groups of bits, not individual isolated bits, so a byte is a far more practical minimum addressable unit for general-purpose computing. With bit-addressable memory, an ordinary 8, 16, 32, or 64-bit value would need many separately addressed pieces instead of one. In byte-addressable memory, one address identifies one byte, and software loads a byte or a larger group, then uses bit operations when it needs an individual bit. Byte-addressability is an architectural design choice, not a law of physics."
        },
        {
         "type": "apply",
         "prompt": "How many distinct patterns can three bits represent? How many can twelve bits represent? Explain your reasoning — don't just state the formula.",
         "answer": "Each bit has two possibilities, so n bits form 2ⁿ patterns. Three bits: 2 × 2 × 2 = 8 patterns. Twelve bits: twelve independent positions, each doubling the count, so 2¹² = 4096 patterns."
        },
        {
         "type": "reasoning",
         "prompt": "The number 1 could be represented with a single binary digit. Why does the value below still occupy eight bytes?",
         "answer": "Its storage width comes from its type, not from how large the current value is. `UInt64` is a 64-bit fixed-width integer, so its representation always occupies 64 bits — 8 bytes — even when the value happens to be 1.",
         "code": "let number = UInt64(1)"
        },
        {
         "type": "debug",
         "prompt": "A developer says: “A byte contains 256 bits. That’s why UInt8 can represent 0 through 255.” Identify and correct the mistake.",
         "answer": "A byte does not contain 256 bits — it contains exactly 8 bits. Since each bit has two possibilities, eight bits can form 2⁸ = 256 distinct patterns. Interpreted as unsigned integers, those patterns represent 0...255. So 256 is the number of possible patterns, not the number of bits."
        },
        {
         "type": "explain",
         "prompt": "Without looking back at the lesson, explain this chain step by step. Then explain one thing MemoryLayout.size does not measure.",
         "code": "physical state → bit → nibble → byte → memory address → Swift type width → MemoryLayout.size",
         "answer": "Computer hardware distinguishes physical states, which we represent as 0 and 1. A bit holds one binary state. Four bits form a nibble; eight bits form a byte. Modern mainstream memory is generally byte-addressable, so an ordinary memory address identifies one byte. Swift types specify a representation width — UInt64, for example, uses 64 bits, or 8 bytes. MemoryLayout<T>.size reports the size of T’s value representation in bytes. It does not measure the total memory a value's whole structure consumes: a collection can reference additional storage elsewhere that this number does not count."
        }
       ],
       "exercises": [
        {
         "brief": "Exercise 1 — Swift byte census (Tier: EXEC)\n\nStep 1 — Predict. Before running anything, write down what you expect MemoryLayout<T>.size to report, in bytes, for UInt8, UInt16, UInt32, UInt64, Bool, and Int.\n\nStep 2 — Run it. Create a Swift playground, an executable project, or a plain Swift file, and run:\n\n```text\nfunc inspect<T>(_ type: T.Type, name: String) {\n    let bytes = MemoryLayout<T>.size\n    let bits = bytes * 8\n    print(\"\\(name): \\(bytes) byte(s) = \\(bits) bits\")\n}\ninspect(UInt8.self, name: \"UInt8\")\ninspect(UInt16.self, name: \"UInt16\")\ninspect(UInt32.self, name: \"UInt32\")\ninspect(UInt64.self, name: \"UInt64\")\ninspect(Bool.self, name: \"Bool\")\ninspect(Int.self, name: \"Int\")\n```\n\nStep 3 — Compare your predictions against the output.",
         "expected": "On a current 64-bit Apple platform, the results should be:\n\n```text\nUInt8: 1 byte(s) = 8 bits\nUInt16: 2 byte(s) = 16 bits\nUInt32: 4 byte(s) = 32 bits\nUInt64: 8 byte(s) = 64 bits\nBool: 1 byte(s) = 8 bits\nInt: 8 byte(s) = 64 bits\n```",
         "done": [
          "Made predictions before running the program",
          "Ran the byte census in a Swift playground, executable project, or simple Swift file",
          "Compared the results with the expected output"
         ]
        },
        {
         "brief": "Exercise 2 — Build one byte by hand (Tier: EXEC)\n\nThe goal is to make an eight-bit value feel concrete rather than abstract. Use pen and paper, or a plain text file — no Swift needed.\n\n1. Draw eight bit positions in a row and number them 7 down to 0, left to right.\n2. Above each position, write its place value: 128, 64, 32, 16, 8, 4, 2, 1.\n3. Pick the target number 173. Starting from the largest place value, mark each position 1 if its value still fits into what's left of 173, and 0 otherwise, subtracting as you go.\n4. Write out the resulting 8-bit pattern.\n5. Convert it back: multiply each bit by its place value and add the results, and confirm you get 173 again.\n6. In one sentence, explain why bit 0 represents the value 1.",
         "expected": "The completed pattern is 10101101. Converting it back — 128 + 32 + 8 + 4 + 1 — produces 173 again.",
         "done": [
          "Drew eight bit positions",
          "Numbered them 7...0",
          "Added the positional values",
          "Constructed 173",
          "Got 10101101",
          "Converted the pattern back into 173",
          "Can explain why bit 0 represents the value 1"
         ]
        },
        {
         "brief": "Exercise 3 — Image-memory calculator (Tier: EXEC)\n\nWrite a Swift function that takes a pixel width, height, and bytes-per-pixel, and reports the raw memory a decoded image of that size needs, in bytes, decimal MB, and binary MiB.\n\nFormulas:\n\n```text\npixels = width × height\nbytes  = pixels × bytesPerPixel\nMB     = bytes / 1,000,000\nMiB    = bytes / 1,048,576\n```\n\nStart from this signature:\n\n```text\nfunc imageMemory(\n    width: Int,\n    height: Int,\n    bytesPerPixel: Int\n) {\n    // Your implementation\n}\n```\n\nBe careful with integer division — convert the byte count to Double before calculating MB and MiB.\n\nRun it on three sizes, writing down a prediction before each run: 640×480, 1920×1080, and 3840×2160 (all RGBA, 4 bytes per pixel).\n\nBefore the 4K case, make a deliberately rough guess — something like “I think a 4K RGBA image will use around 8 MB” — then run the calculation and see how far off you were. A strong explanation of the miss: a 4K image has more than eight million pixels, and at four bytes each that's more than 33 million raw bytes.\n\nExtension challenge: a collection view holds 20 decoded 1920×1080 RGBA images at once. Ignoring every other memory cost, estimate the raw pixel storage for all 20, then explain why blindly caching full-resolution decoded images can be dangerous in an iOS app.",
         "expected": "One possible implementation — only look at this after attempting it yourself:\n\n```text\nfunc imageMemory(\n    width: Int,\n    height: Int,\n    bytesPerPixel: Int\n) {\n    let totalPixels = width * height\n    let totalBytes = totalPixels * bytesPerPixel\n    let mb = Double(totalBytes) / 1_000_000\n    let mib = Double(totalBytes) / 1_048_576\n    print(\"Resolution: \\(width) × \\(height)\")\n    print(\"Pixels: \\(totalPixels)\")\n    print(\"Bytes per pixel: \\(bytesPerPixel)\")\n    print(\"Total bytes: \\(totalBytes)\")\n    print(\"MB: \\(mb)\")\n    print(\"MiB: \\(mib)\")\n}\n```\n\nThe 4K case (3840×2160, 4 bytes per pixel) should print approximately 33,177,600 bytes, 33.18 MB, 31.64 MiB.\n\nExtension: one 1920×1080 RGBA image is 8,294,400 bytes, so 20 of them is 8,294,400 × 20 = 165,888,000 bytes — roughly 165.9 MB or 158.2 MiB.",
         "done": [
          "Implemented imageMemory(width:height:bytesPerPixel:)",
          "Ran the three specified image sizes",
          "Wrote a prediction before each run",
          "Made one deliberately wrong estimate and explained it",
          "Completed the collection-view extension challenge"
         ]
        }
       ]
      },
      {
       "id": "p0a-02",
       "title": "Binary and hexadecimal",
       "tier": "EXEC",
       "read": "1. Binary gets long fast\n\nThe previous lesson showed a byte written in binary, like `10101101`. Eight digits. That's easy to scan.\n\nReal values are often much wider. A 32-bit integer has 32 bits. A 64-bit memory address has 64 bits. Written in binary, a 32-bit value looks like this:\n\n```text\n11010110110000110010110111101001\n```\n\nThat's hard to read at a glance. Programmers needed a shorter way to write bit patterns, without losing the ability to see the bits underneath. That is the problem hexadecimal solves.\n\n2. What hexadecimal is\n\nHexadecimal, usually shortened to hex, is a number system with base 16.\n\nDecimal uses ten symbols: `0 1 2 3 4 5 6 7 8 9`. Hexadecimal needs sixteen. It reuses `0` through `9`, then adds six letters: `A B C D E F`.\n\n```text\nA = 10\nB = 11\nC = 12\nD = 13\nE = 14\nF = 15\n```\n\nSo `0xF` means decimal `15`, and `0x10` means decimal `16`. The `0x` prefix is how programming languages and debuggers mark a number as hexadecimal.\n\n3. Why hexadecimal fits computers so well\n\nThis is the important part. One bit has 2 possible values. Four bits have `2⁴ = 16` possible patterns. One hexadecimal digit also has 16 possible values.\n\nSo `4 bits ↔ 1 hexadecimal digit`, exactly, with nothing left over.\n\nThe previous lesson named that group of 4 bits a nibble. So the relationship is:\n\n```text\n1 nibble = 4 bits = 1 hex digit\n```\n\nThat's the real reason hex is convenient. It isn't just a shorter number system. Its digits line up exactly with a group of bits.\n\n4. The nibble-to-hex table\n\nThese are the sixteen possible four-bit patterns:\n\n```text\nBinary  Hex\n0000    0\n0001    1\n0010    2\n0011    3\n0100    4\n0101    5\n0110    6\n0111    7\n1000    8\n1001    9\n1010    A\n1011    B\n1100    C\n1101    D\n1110    E\n1111    F\n```\n\nYou don't need to memorize this table today. But you should see why it exists: each row is one nibble next to the one hex digit it maps to. For example, `1111` is a nibble whose decimal value is 15, and hex writes 15 as `F`. So `1111 ↔ F`.\n\n5. Why a byte is naturally two hex digits\n\nOne byte is 8 bits, so it splits into exactly two nibbles:\n\n```text\n1111 0010\n```\n\nConvert each nibble on its own:\n\n```text\n1111 → F\n0010 → 2\n```\n\nSo `11110010` can be written `0xF2`. Two nibbles, two hex digits, one byte:\n\n```text\n1 byte = 8 bits = 2 nibbles = 2 hex digits\n```\n\nEvery possible byte falls somewhere between `0x00` and `0xFF`. Remember that relationship — it comes back constantly.\n\n6. Hex keeps the bit structure; decimal hides it\n\nSuppose a byte holds `11110110`. In decimal that's `246`. In hex that's `F6`.\n\nLooking only at `246`, you can't easily tell what the bits look like. But `F6` breaks apart on sight: `F → 1111`, `6 → 0110`. So `0xF6` means `11110110`.\n\nCompare all three side by side for the same byte:\n\n```text\nBinary:  11010110\nHex:     D6\nDecimal: 214\n```\n\nBinary shows individual bits. Hex shows compact groups of bits. Decimal is for ordinary arithmetic. Each notation is useful for a different job.\n\n7. A number is not its representation\n\nThis distinction matters. `42`, `0b00101010`, and `0x2A` are not three different values. They are three ways of writing the same value — the way `42`, `forty-two`, and `XLII` all name the same quantity.\n\n```text\nlet a = 42\nlet b = 0b00101010\nlet c = 0x2A\n\nprint(a == b)\nprint(b == c)\n```\n\nBoth print `true`. So when a debugger shows you `0x2A`, the machine does not store the characters `\"0x2A\"` anywhere. Hex is a human-readable way to display an underlying numeric or bit value — the value itself doesn't know or care which notation you used to write it.\n\n8. Binary to hex, without going through decimal\n\nTake `11010110`. Group it into nibbles:\n\n```text\n1101 0110\n```\n\nConvert each nibble on its own:\n\n```text\n1101 → D\n0110 → 6\n```\n\nSo `11010110 = 0xD6`. No decimal step was needed anywhere in that conversion.\n\n9. Hex to binary, the same way in reverse\n\nTake `0xB6`. Convert each hex digit on its own:\n\n```text\nB → 1011\n6 → 0110\n```\n\nSo `0xB6 = 10110110`. Again, no decimal step. This is the conversion skill worth being comfortable with, because it mirrors exactly how hex gets used in systems work: one digit at a time, four bits at a time.\n\n10. You rarely convert a big hex number to decimal by hand\n\nWhen you see `0xFF`, it's worth eventually recognizing `11111111`, and knowing that's `255` for an unsigned byte. But if LLDB shows you `0x000000016F443E70`, you generally don't sit down and convert that to decimal.\n\nWhat actually matters is recognizing what you're looking at. This is hexadecimal. It represents a numeric or bit-pattern value. Every two digits are one byte, and every digit is four bits. This particular value is probably an address or a raw machine value. Understanding what the notation represents matters far more than computing its decimal equivalent by hand.\n\n11. Where hex shows up: memory addresses and LLDB\n\nWhile debugging, you'll see values like `0x000000016F29C480`. That's a memory address, written in hex.\n\nWhy hex and not binary? A modern address has many bits — writing it in binary would run to dozens of digits. Hex is far more compact, and because each digit is four bits, the underlying bit pattern is still fully recoverable if you ever need it.\n\nLLDB, Xcode's debugger, prints addresses and raw register values the same way — for example `0x00000000000000FF`. You don't need to convert these to decimal. You need to recognize the `0x` and know why the debugger chose that notation: it's compact, and it keeps a direct relationship to the underlying bits.\n\n12. Where hex shows up: raw bytes and Data\n\nFoundation's `Data` type represents raw bytes. If a `Data` value holds the byte values `72` and `105`, a hex dump shows them as `48 69` — meaning `0x48` and `0x69`. Each pair is one byte.\n\nThis comes up constantly: HTTP bodies, binary APIs, image data, encryption, compression, file formats, device protocols, sockets. If someone hands you `89 50 4E 47`, you should recognize that as a sequence of byte values, written in hex, one pair per byte.\n\n13. Where hex shows up: colors, UUIDs, and Unicode\n\nYou've likely seen a color written as `#FF0000`, or in Swift as `UIColor(hex: 0xFF0000)`. Split it into pairs: `FF 00 00`. Three pairs, three bytes — one for red, one for green, one for blue. Since `0xFF = 255`, red is at its maximum byte value. Six hex digits for a color is a direct consequence of `1 byte = 2 hex digits`. Different APIs order the channels differently — `RRGGBB`, `AARRGGBB`, `RRGGBBAA` — so always check which one you're using rather than assuming.\n\nUUIDs, like `550E8400-E29B-41D4-A716-446655440000`, are mostly hex digits too. A UUID is fundamentally a 128-bit value, and hex groups are just how it's displayed for humans.\n\nUnicode code points follow the same pattern: `U+0041` names a code point in hex. We'll study text encoding properly in a later lesson — for now, just notice that hex shows up there too, for the same underlying reason.\n\n14. Swift hexadecimal and binary literals\n\nSwift lets you write integer literals directly in hex or binary:\n\n```text\nlet value = 0xFF\nlet another = 0x2A\nlet inBinary = 0b101010\n```\n\n`0xFF` is `255`. `0x2A` and `0b101010` are both `42`:\n\n```text\nlet a = 42\nlet b = 0b101010\nlet c = 0x2A\n\nprint(a == b && b == c)\n```\n\nThat prints `true`. The notation changed; the integer value underneath did not.\n\n15. Converting between hex text and integers in Swift\n\nGiven an integer, ask Swift for its hex text.\n\n```text\nlet hex = String(255, radix: 16)\n// \"ff\"\n\nlet hexUpper = String(255, radix: 16, uppercase: true)\n// \"FF\"\n```\n\nGiven hex text, parse it back into an integer.\n\n```text\nlet value = Int(\"FF\", radix: 16)\n// value = 255\n```\n\nThat result is optional, because the text might not be valid hex. `Int(\"ZZ\", radix: 16)` returns `nil` instead — `Z` isn't a hex digit, so there's nothing valid to parse. This distinction, between an integer value and its hex-text representation, matters constantly at the boundary between text and binary data. JSON, APIs, user input, color strings, device identifiers, and server responses all cross that boundary.\n\n16. The shortcut worth keeping\n\nYou should eventually be able to glance at `0xFF` and think: two hex digits, eight bits, one byte. At `0xFFFF`: four digits, sixteen bits, two bytes. At `0xFFFFFFFF`: eight digits, thirty-two bits, four bytes.\n\n```text\n1 hex digit  = 4 bits\n2 hex digits = 1 byte\n```\n\nThat single rule is more useful than memorizing a long list of hex-to-decimal conversions. It's also the rule later topics lean on directly. Bitmasks like `0x0F` and `0xF0` use it. So do shifting bit patterns, two's complement values like `0xFF` and `0x80`, and multi-byte values like `0x12345678` when we study endianness.",
       "points": [
        {
         "t": "Binary vs hex vs decimal",
         "d": "Binary shows individual bits. Hex shows compact groups of bits. Decimal is for ordinary arithmetic."
        },
        {
         "t": "The core relationship",
         "d": "1 hex digit = 4 bits = 1 nibble. 2 hex digits = 1 byte."
        },
        {
         "t": "A byte's hex range",
         "d": "Every possible byte is somewhere between 0x00 and 0xFF."
        },
        {
         "t": "Notation is not value",
         "d": "42, 0b00101010, and 0x2A are the same value written three ways."
        },
        {
         "t": "Convert digit by digit",
         "d": "Binary to hex and hex to binary both convert one nibble or one digit at a time — no decimal step needed."
        },
        {
         "t": "You rarely hand-convert big hex numbers",
         "d": "Recognizing what a hex value represents matters more than computing its decimal equivalent."
        }
       ],
       "connection": {
        "down": "Hex is not a second thing stored next to binary. It is a compact way for humans to read and write the same bit patterns the machine already uses.",
        "up": "Memory addresses, LLDB output, Data byte dumps, colors, UUIDs, and Unicode code points all lean on this same 4-bits-per-digit relationship."
       },
       "questions": [
        {
         "type": "recall",
         "prompt": "What is hexadecimal, and why does it need the letters A through F?",
         "answer": "Hexadecimal is a base-16 number system. It needs sixteen digit values. `0` through `9` supply ten symbols, so `A` through `F` cover the remaining six values, 10 through 15."
        },
        {
         "type": "reasoning",
         "prompt": "Why does one hexadecimal digit map exactly to four bits, with nothing left over?",
         "answer": "Four bits have 2⁴ = 16 possible patterns. One hexadecimal digit also has exactly 16 possible values, 0 through F. Since both sides have exactly 16 possibilities, every four-bit pattern maps to exactly one hex digit, and every hex digit maps to exactly one four-bit pattern."
        },
        {
         "type": "trace",
         "prompt": "Convert `10110110` directly into hexadecimal. Show the nibble grouping, not just the final answer.",
         "answer": "Group into nibbles: `1011 0110`. Convert each one: `1011 → B`, `0110 → 6`. So `10110110 = 0xB6`."
        },
        {
         "type": "trace",
         "prompt": "Before running it, predict what each line prints.",
         "code": "let a = 0x2A\nlet b = 0b00101010\n\nprint(a)\nprint(b)\nprint(a == b)\nprint(String(255, radix: 16, uppercase: true))",
         "answer": "Expected: `42`, `42`, `true`, `FF`. `a` prints as `42` because `0x2A` is only the source-code notation used to create the integer. `print` shows the ordinary decimal form unless you explicitly ask for something else, as the last line does with `radix: 16`."
        },
        {
         "type": "debug",
         "prompt": "A teammate says: \"A byte can be written as one hex digit, since hex is more compact than binary.\" What's wrong with that claim?",
         "answer": "One hex digit only covers 4 bits, a nibble — not a full byte. A byte is 8 bits, which needs exactly two hex digits, one per nibble. A single hex digit can represent at most `0xF`, decimal 15, far short of a byte's full range of 0 to 255."
        },
        {
         "type": "apply",
         "prompt": "Without running any code, convert `0xA7` into binary, and state how many bytes `0xFFFFFF` represents.",
         "answer": "`0xA7`: `A → 1010`, `7 → 0111`, so `0xA7 = 10100111`. `0xFFFFFF` has six hex digits; at two hex digits per byte, that's three bytes."
        },
        {
         "type": "explain",
         "prompt": "Explain why a debugger prints a memory address in hex instead of decimal or binary.",
         "answer": "Binary would make a modern address dozens of digits long — too long to read at a glance. Decimal is compact but its digits don't align with groups of bits. Hex stays compact while each digit still corresponds to exactly four bits, so the debugger can show a machine-sized value that a programmer can still relate back to its bit pattern."
        }
       ],
       "exercises": [
        {
         "brief": "Exercise 1 — Binary and hex by hand (Tier: EXEC)\n\nNo code — pen and paper, or a plain text file.\n\nConvert these bytes into hex, by grouping into nibbles first:\n\n```text\n00000000\n11111111\n10101010\n01011100\n```\n\nThen convert these hex values back into binary, one digit at a time:\n\n```text\n0x2A\n0x80\n0xF0\n0x3C\n```\n\nDon't go through decimal for either direction. Group into nibbles, then convert each nibble or digit on its own.",
         "expected": "```text\n00000000 → 0x00\n11111111 → 0xFF\n10101010 → 0xAA\n01011100 → 0x5C\n\n0x2A → 00101010\n0x80 → 10000000\n0xF0 → 11110000\n0x3C → 00111100\n```",
         "done": [
          "Converted all four bytes to hex by grouping into nibbles",
          "Converted all four hex values back to binary, one digit at a time",
          "Did not go through decimal for either direction"
         ]
        },
        {
         "brief": "Exercise 2 — Hex and binary literals in Swift (Tier: EXEC)\n\nPredict the output first. Then run this in a playground, executable project, or plain Swift file.\n\n```text\nlet a = 0x2A\nlet b = 0b00101010\n\nprint(a)\nprint(b)\nprint(a == b)\n\nprint(String(255, radix: 16, uppercase: true))\nprint(String(42, radix: 2))\n\nprint(Int(\"FF\", radix: 16) as Any)\nprint(Int(\"ZZ\", radix: 16) as Any)\n```\n\nAfter running it, write one or two sentences on two things. Explain why `a` prints as `42` even though the source code wrote `0x2A`. Explain why the last line prints `nil`.",
         "expected": "```text\n42\n42\ntrue\nFF\n101010\nOptional(255)\nnil\n```\n\n`0x2A` is only the notation used in source code to build the integer — the stored value has no memory of which notation created it, so `print` shows the ordinary decimal form. `Int(\"ZZ\", radix: 16)` returns `nil` because `Z` is not a valid hex digit, so there's nothing valid to parse.",
         "done": [
          "Predicted the output before running",
          "Ran the code and compared against the prediction",
          "Explained why `a` prints as `42`",
          "Explained why the last line prints `nil`"
         ]
        },
        {
         "brief": "Exercise 3 — Inspect real bytes as hex (Tier: EXEC)\n\nRun this.\n\n```text\nlet bytes = Array(\"Hi\".utf8)\n\nfor byte in bytes {\n    let hex = String(byte, radix: 16, uppercase: true)\n    print(byte, hex)\n}\n```\n\nWrite down the decimal and hex value for each byte. Then confirm each hex value by hand: split it into two nibbles, and check each nibble against the table from this lesson.",
         "expected": "```text\n72 48\n105 69\n```\n\n`72` in hex is `48`: `4 → 0100`, `8 → 1000`, and `01001000` in binary is indeed 72. `105` in hex is `69`: `6 → 0110`, `9 → 1001`, and `01101001` in binary is indeed 105. You don't need to know yet why UTF-8 chose these particular byte values for `\"H\"` and `\"i\"` — that comes in the text-encoding lesson.",
         "done": [
          "Ran the code and recorded both byte values",
          "Confirmed at least one hex value by hand, nibble by nibble"
         ]
        }
       ]
      },
      {
       "id": "p0a-03",
       "title": "Signed integers and two's complement",
       "tier": "EXEC"
      },
      {
       "id": "p0a-04",
       "title": "Floating point and the precision surprise",
       "tier": "EXEC"
      },
      {
       "id": "p0a-05",
       "title": "Text: ASCII, Unicode, UTF-8",
       "tier": "EXEC"
      },
      {
       "id": "p0a-06",
       "title": "Endianness",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Binary inspector. Encode and decode values by hand and in code, inspect the bytes, and demonstrate an overflow and a float-precision surprise."
     }
    },
    {
     "id": "p0b",
     "name": "CPU and instructions",
     "lessons": [
      {
       "id": "p0b-01",
       "title": "What a CPU actually does",
       "tier": "DOC"
      },
      {
       "id": "p0b-02",
       "title": "Registers and the program counter",
       "tier": "EXEC"
      },
      {
       "id": "p0b-03",
       "title": "The instruction cycle: fetch, decode, execute",
       "tier": "DOC"
      },
      {
       "id": "p0b-04",
       "title": "Reading the assembly your Swift becomes",
       "tier": "EXEC"
      },
      {
       "id": "p0b-05",
       "title": "Cores, and why more of them means parallel work",
       "tier": "EXEC"
      },
      {
       "id": "p0b-06",
       "title": "Cache and locality",
       "tier": "EXEC"
      },
      {
       "id": "p0b-07",
       "title": "Context switching, and what it costs",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Execution microscope. Compile tiny functions, inspect the stack and disassembly in the debugger, and time a cache-friendly loop against a cache-hostile one."
     }
    },
    {
     "id": "p0c",
     "name": "Memory",
     "lessons": [
      {
       "id": "p0c-01",
       "title": "Addresses and pointers",
       "tier": "EXEC"
      },
      {
       "id": "p0c-02",
       "title": "RAM vs persistent storage",
       "tier": "EXEC"
      },
      {
       "id": "p0c-03",
       "title": "The stack",
       "tier": "EXEC"
      },
      {
       "id": "p0c-04",
       "title": "The heap",
       "tier": "EXEC"
      },
      {
       "id": "p0c-05",
       "title": "Allocation and deallocation",
       "tier": "EXEC"
      },
      {
       "id": "p0c-06",
       "title": "Copying a value vs sharing a reference",
       "tier": "EXEC"
      },
      {
       "id": "p0c-07",
       "title": "Fragmentation",
       "tier": "EXEC"
      },
      {
       "id": "p0c-08",
       "title": "The memory hierarchy, in real numbers",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Memory laboratory. Stack traces, heap allocations, a large buffer, object lifetime, and a memory-growth experiment you can explain line by line."
     }
    },
    {
     "id": "p0d",
     "name": "Program execution",
     "lessons": [
      {
       "id": "p0d-01",
       "title": "What an executable file is",
       "tier": "EXEC"
      },
      {
       "id": "p0d-02",
       "title": "Code, data, and the other sections",
       "tier": "EXEC"
      },
      {
       "id": "p0d-03",
       "title": "What happens when a program is loaded",
       "tier": "EXEC"
      },
      {
       "id": "p0d-04",
       "title": "The function call",
       "tier": "EXEC"
      },
      {
       "id": "p0d-05",
       "title": "The stack frame",
       "tier": "EXEC"
      },
      {
       "id": "p0d-06",
       "title": "The return address",
       "tier": "EXEC"
      },
      {
       "id": "p0d-07",
       "title": "Crashes: bad access, stack overflow, out of memory",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Program trace. Document one small program from source to executable to process to function call to memory to crash."
     }
    }
   ],
   "capstone": {
    "brief": "Systems Trace Lab. Take a small program and produce a source-to-CPU/memory execution map with debugger observations."
   }
  },
  {
   "id": "p1",
   "name": "Operating Systems",
   "purpose": "The environment that owns processes, threads, memory, files, permissions, scheduling and lifecycle.",
   "questions": [
    "Which process or thread is involved?",
    "Is the work running, blocked, sleeping or waiting on I/O?",
    "What resource does the OS own?",
    "What happens under memory pressure or a lifecycle change?"
   ],
   "chapters": [
    {
     "id": "p1a",
     "name": "Processes and threads",
     "lessons": [
      {
       "id": "p1a-01",
       "title": "Program vs process",
       "tier": "EXEC"
      },
      {
       "id": "p1a-02",
       "title": "The process address space",
       "tier": "EXEC"
      },
      {
       "id": "p1a-03",
       "title": "What a thread is",
       "tier": "EXEC"
      },
      {
       "id": "p1a-04",
       "title": "The main thread",
       "tier": "EXEC"
      },
      {
       "id": "p1a-05",
       "title": "User mode vs kernel mode",
       "tier": "DOC"
      },
      {
       "id": "p1a-06",
       "title": "System calls",
       "tier": "EXEC"
      },
      {
       "id": "p1a-07",
       "title": "How a process starts and how it ends",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Process explorer. Inspect process and thread state and trace one blocking operation all the way down."
     }
    },
    {
     "id": "p1b",
     "name": "Scheduling",
     "lessons": [
      {
       "id": "p1b-01",
       "title": "The scheduler",
       "tier": "DOC"
      },
      {
       "id": "p1b-02",
       "title": "Runnable, running, waiting",
       "tier": "EXEC"
      },
      {
       "id": "p1b-03",
       "title": "Priority and quality of service",
       "tier": "EXEC"
      },
      {
       "id": "p1b-04",
       "title": "CPU-bound vs I/O-bound work",
       "tier": "EXEC"
      },
      {
       "id": "p1b-05",
       "title": "Why blocking the main thread freezes the screen",
       "tier": "EXEC"
      },
      {
       "id": "p1b-06",
       "title": "What a context switch costs",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Responsive-work demo. Compare blocking UI work against scheduled background work and explain the scheduler's part in both."
     }
    },
    {
     "id": "p1c",
     "name": "Virtual memory",
     "lessons": [
      {
       "id": "p1c-01",
       "title": "Virtual vs physical memory: the address is a lie",
       "tier": "EXEC"
      },
      {
       "id": "p1c-02",
       "title": "Pages, and the fault that fills them",
       "tier": "EXEC"
      },
      {
       "id": "p1c-03",
       "title": "Memory protection",
       "tier": "EXEC"
      },
      {
       "id": "p1c-04",
       "title": "Copy-on-write, at the page level",
       "tier": "EXEC"
      },
      {
       "id": "p1c-05",
       "title": "mmap: why a 300 MB file isn't 300 MB of RAM",
       "tier": "EXEC"
      },
      {
       "id": "p1c-06",
       "title": "Clean vs dirty, and why iOS has no swap",
       "tier": "EXEC"
      },
      {
       "id": "p1c-07",
       "title": "Memory pressure and jetsam",
       "tier": "DOC"
      },
      {
       "id": "p1c-08",
       "title": "Measuring it: footprint vs resident vs virtual",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Memory-pressure lab. Allocations, copy behaviour, warning and termination concepts, and a measurement you trust."
     }
    },
    {
     "id": "p1d",
     "name": "Files and the iOS process environment",
     "lessons": [
      {
       "id": "p1d-01",
       "title": "File descriptors",
       "tier": "EXEC"
      },
      {
       "id": "p1d-02",
       "title": "Directories, paths, and the app container",
       "tier": "EXEC"
      },
      {
       "id": "p1d-03",
       "title": "Buffered I/O and flushing",
       "tier": "EXEC"
      },
      {
       "id": "p1d-04",
       "title": "File permissions and metadata",
       "tier": "EXEC"
      },
      {
       "id": "p1d-05",
       "title": "Atomic replacement",
       "tier": "EXEC"
      },
      {
       "id": "p1d-06",
       "title": "The app sandbox",
       "tier": "DOC"
      },
      {
       "id": "p1d-07",
       "title": "App lifecycle, suspension, and background limits",
       "tier": "DEV"
      }
     ],
     "project": {
      "brief": "Sandboxed storage app. Read and write files in the correct containers and document the lifecycle and background constraints you hit."
     }
    }
   ],
   "capstone": {
    "brief": "OS Behavior Explorer. A small iOS diagnostic app demonstrating lifecycle, threads, files, memory pressure and background limits."
   }
  },
  {
   "id": "p2",
   "name": "Compiler, Linker and Runtime",
   "purpose": "What happens between Swift source and machine instructions, and where compile-time behaviour ends and runtime behaviour begins.",
   "questions": [
    "What is decided at compile time?",
    "What is left for link, load or runtime?",
    "Which symbol, type or metadata is involved?",
    "What ownership or dispatch mechanism explains the behaviour?"
   ],
   "chapters": [
    {
     "id": "p2a",
     "name": "The compilation pipeline",
     "lessons": [
      {
       "id": "p2a-01",
       "title": "What a compiler actually is",
       "tier": "DOC"
      },
      {
       "id": "p2a-02",
       "title": "Lexing: source text into tokens",
       "tier": "EXEC"
      },
      {
       "id": "p2a-03",
       "title": "Parsing and the AST",
       "tier": "EXEC"
      },
      {
       "id": "p2a-04",
       "title": "Type checking",
       "tier": "EXEC"
      },
      {
       "id": "p2a-05",
       "title": "SIL and IR: the middle languages",
       "tier": "EXEC"
      },
      {
       "id": "p2a-06",
       "title": "Optimization",
       "tier": "EXEC"
      },
      {
       "id": "p2a-07",
       "title": "Machine-code generation",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Compiler-errors notebook. Create syntax, type and generic errors on purpose and classify which phase rejected each one."
     }
    },
    {
     "id": "p2b",
     "name": "Linking and loading",
     "lessons": [
      {
       "id": "p2b-01",
       "title": "Object files",
       "tier": "EXEC"
      },
      {
       "id": "p2b-02",
       "title": "Symbols and name mangling",
       "tier": "EXEC"
      },
      {
       "id": "p2b-03",
       "title": "Static libraries",
       "tier": "EXEC"
      },
      {
       "id": "p2b-04",
       "title": "Dynamic libraries and frameworks",
       "tier": "EXEC"
      },
      {
       "id": "p2b-05",
       "title": "What the linker does",
       "tier": "EXEC"
      },
      {
       "id": "p2b-06",
       "title": "Linker errors vs compiler errors",
       "tier": "EXEC"
      },
      {
       "id": "p2b-07",
       "title": "dyld, and what load time costs",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Binary dependency map. Inspect a real dependency graph and trace one symbol to the code that defines it."
     }
    },
    {
     "id": "p2c",
     "name": "Runtime mechanisms",
     "lessons": [
      {
       "id": "p2c-01",
       "title": "Runtime metadata",
       "tier": "EXEC"
      },
      {
       "id": "p2c-02",
       "title": "Static vs dynamic dispatch",
       "tier": "EXEC"
      },
      {
       "id": "p2c-03",
       "title": "Vtables",
       "tier": "EXEC"
      },
      {
       "id": "p2c-04",
       "title": "Protocol witness tables",
       "tier": "EXEC"
      },
      {
       "id": "p2c-05",
       "title": "The Objective-C runtime",
       "tier": "EXEC"
      },
      {
       "id": "p2c-06",
       "title": "ABI and module stability",
       "tier": "DOC"
      }
     ],
     "project": {
      "brief": "Dispatch lab. Compare final, class, protocol and `@objc` calls and prove which mechanism each one used."
     }
    },
    {
     "id": "p2d",
     "name": "ARC and ownership machinery",
     "lessons": [
      {
       "id": "p2d-01",
       "title": "Reference counting",
       "tier": "EXEC"
      },
      {
       "id": "p2d-02",
       "title": "Where retain and release are inserted",
       "tier": "EXEC"
      },
      {
       "id": "p2d-03",
       "title": "deinit and deterministic destruction",
       "tier": "EXEC"
      },
      {
       "id": "p2d-04",
       "title": "Closure capture and the context box",
       "tier": "EXEC"
      },
      {
       "id": "p2d-05",
       "title": "weak and unowned",
       "tier": "EXEC"
      },
      {
       "id": "p2d-06",
       "title": "Retain cycles, and how to prove one",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Ownership debugger. Create a leak on purpose, prove it with `deinit` and the Memory Graph, then fix it."
     }
    }
   ],
   "capstone": {
    "brief": "Source-to-Runtime Report. Pick one Swift feature and trace it from syntax through compile, link, load and runtime behaviour."
   }
  },
  {
   "id": "p3",
   "name": "Swift",
   "purpose": "You already write Swift. This path removes blind spots, installs precise terminology, and connects syntax to semantics.",
   "questions": [
    "What is the exact type?",
    "Value or reference semantics?",
    "Who owns this?",
    "What does the compiler guarantee, and what can still fail at runtime?"
   ],
   "chapters": [
    {
     "id": "p3a",
     "name": "Language core",
     "lessons": [
      {
       "id": "p3a-01",
       "title": "let and var",
       "tier": "EXEC"
      },
      {
       "id": "p3a-02",
       "title": "The primitive types and their sizes",
       "tier": "EXEC"
      },
      {
       "id": "p3a-03",
       "title": "Operators",
       "tier": "EXEC"
      },
      {
       "id": "p3a-04",
       "title": "Control flow",
       "tier": "EXEC"
      },
      {
       "id": "p3a-05",
       "title": "Optionals",
       "tier": "EXEC"
      },
      {
       "id": "p3a-06",
       "title": "Optional is an enum",
       "tier": "EXEC"
      },
      {
       "id": "p3a-07",
       "title": "Tuples and ranges",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Swift fundamentals kata pack. Transformations, optional handling, collection reasoning, and prediction exercises."
     }
    },
    {
     "id": "p3b",
     "name": "Functions and closures",
     "lessons": [
      {
       "id": "p3b-01",
       "title": "Functions and argument labels",
       "tier": "EXEC"
      },
      {
       "id": "p3b-02",
       "title": "Default, inout and variadic parameters",
       "tier": "EXEC"
      },
      {
       "id": "p3b-03",
       "title": "Functions as values",
       "tier": "EXEC"
      },
      {
       "id": "p3b-04",
       "title": "What a closure physically is",
       "tier": "EXEC"
      },
      {
       "id": "p3b-05",
       "title": "Captures",
       "tier": "EXEC"
      },
      {
       "id": "p3b-06",
       "title": "escaping",
       "tier": "EXEC"
      },
      {
       "id": "p3b-07",
       "title": "Capture lists",
       "tier": "EXEC"
      },
      {
       "id": "p3b-08",
       "title": "map, filter, reduce",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Callback engine. Design synchronous and escaping callback APIs, then diagnose the capture and lifetime bugs you built into them."
     }
    },
    {
     "id": "p3c",
     "name": "Type modeling",
     "lessons": [
      {
       "id": "p3c-01",
       "title": "Structs",
       "tier": "EXEC"
      },
      {
       "id": "p3c-02",
       "title": "Classes",
       "tier": "EXEC"
      },
      {
       "id": "p3c-03",
       "title": "Value vs reference semantics: the decision",
       "tier": "EXEC"
      },
      {
       "id": "p3c-04",
       "title": "Enums",
       "tier": "EXEC"
      },
      {
       "id": "p3c-05",
       "title": "Enums with payloads",
       "tier": "EXEC"
      },
      {
       "id": "p3c-06",
       "title": "Stored, computed and observed properties",
       "tier": "EXEC"
      },
      {
       "id": "p3c-07",
       "title": "Initializers and inheritance",
       "tier": "EXEC"
      },
      {
       "id": "p3c-08",
       "title": "final, and identity",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Domain model project. Model one real feature with value and reference types, and justify every choice in writing."
     }
    },
    {
     "id": "p3d",
     "name": "Protocols and generics",
     "lessons": [
      {
       "id": "p3d-01",
       "title": "Protocols",
       "tier": "EXEC"
      },
      {
       "id": "p3d-02",
       "title": "Extensions and default implementations",
       "tier": "EXEC"
      },
      {
       "id": "p3d-03",
       "title": "Protocol composition",
       "tier": "EXEC"
      },
      {
       "id": "p3d-04",
       "title": "Associated types",
       "tier": "EXEC"
      },
      {
       "id": "p3d-05",
       "title": "Generic functions",
       "tier": "EXEC"
      },
      {
       "id": "p3d-06",
       "title": "Generic types and constraints",
       "tier": "EXEC"
      },
      {
       "id": "p3d-07",
       "title": "where clauses",
       "tier": "EXEC"
      },
      {
       "id": "p3d-08",
       "title": "any vs some: the existential box",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Generic component library. Reusable repository, result and collection utilities behind protocol abstractions."
     }
    },
    {
     "id": "p3e",
     "name": "Errors, ownership and standard protocols",
     "lessons": [
      {
       "id": "p3e-01",
       "title": "Error and throws",
       "tier": "EXEC"
      },
      {
       "id": "p3e-02",
       "title": "do, catch, and the second return path",
       "tier": "EXEC"
      },
      {
       "id": "p3e-03",
       "title": "try? and Result",
       "tier": "EXEC"
      },
      {
       "id": "p3e-04",
       "title": "Equatable",
       "tier": "EXEC"
      },
      {
       "id": "p3e-05",
       "title": "Hashable",
       "tier": "EXEC"
      },
      {
       "id": "p3e-06",
       "title": "Comparable",
       "tier": "EXEC"
      },
      {
       "id": "p3e-07",
       "title": "Type casting and metatypes",
       "tier": "EXEC"
      },
      {
       "id": "p3e-08",
       "title": "Copy-on-write in the standard library",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Robust model layer. Typed errors, hashable identity, ownership-safe callbacks, and tests."
     }
    }
   ],
   "capstone": {
    "brief": "Swift Core Library. A tested Swift package or CLI using protocols, generics, errors, value semantics, reference ownership and docs."
   }
  },
  {
   "id": "p4",
   "name": "UIKit",
   "purpose": "Master the public API surface, then the machinery that explains lifecycle, layout, events, rendering and performance.",
   "questions": [
    "Where is this object in the hierarchy?",
    "Which lifecycle, layout or event phase is active?",
    "Why must this happen on the main thread?",
    "What work reaches Core Animation and the GPU?"
   ],
   "chapters": [
    {
     "id": "p4a",
     "name": "Views and controllers",
     "lessons": [
      {
       "id": "p4a-01",
       "title": "UIView",
       "tier": "EXEC"
      },
      {
       "id": "p4a-02",
       "title": "The view hierarchy",
       "tier": "EXEC"
      },
      {
       "id": "p4a-03",
       "title": "The view controller lifecycle",
       "tier": "EXEC"
      },
      {
       "id": "p4a-04",
       "title": "View loading, and isViewLoaded",
       "tier": "EXEC"
      },
      {
       "id": "p4a-05",
       "title": "The controls you use every day",
       "tier": "EXEC"
      },
      {
       "id": "p4a-06",
       "title": "Storyboard vs XIB vs programmatic",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Lifecycle laboratory. A multi-screen app logging creation, appearance, disappearance, deinit and every hierarchy change."
     }
    },
    {
     "id": "p4b",
     "name": "Layout",
     "lessons": [
      {
       "id": "p4b-01",
       "title": "frame, bounds, center",
       "tier": "EXEC"
      },
      {
       "id": "p4b-02",
       "title": "Coordinate conversion",
       "tier": "EXEC"
      },
      {
       "id": "p4b-03",
       "title": "Auto Layout: constraints are equations",
       "tier": "EXEC"
      },
      {
       "id": "p4b-04",
       "title": "The layout pass: mark now, solve later",
       "tier": "EXEC"
      },
      {
       "id": "p4b-05",
       "title": "Safe areas",
       "tier": "EXEC"
      },
      {
       "id": "p4b-06",
       "title": "Intrinsic content size",
       "tier": "EXEC"
      },
      {
       "id": "p4b-07",
       "title": "Hugging and compression resistance",
       "tier": "EXEC"
      },
      {
       "id": "p4b-08",
       "title": "Self-sizing cells",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Adaptive layout project. One complex screen supporting Dynamic Type and rotation with zero ambiguous constraints."
     }
    },
    {
     "id": "p4c",
     "name": "Navigation and containers",
     "lessons": [
      {
       "id": "p4c-01",
       "title": "UINavigationController",
       "tier": "EXEC"
      },
      {
       "id": "p4c-02",
       "title": "Tab bars",
       "tier": "EXEC"
      },
      {
       "id": "p4c-03",
       "title": "Presentation",
       "tier": "EXEC"
      },
      {
       "id": "p4c-04",
       "title": "Child view controllers",
       "tier": "EXEC"
      },
      {
       "id": "p4c-05",
       "title": "Appearance transitions",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Navigation shell. A coordinator-ready multi-flow app whose navigation stack you can inspect and explain."
     }
    },
    {
     "id": "p4d",
     "name": "Lists and state-driven UI",
     "lessons": [
      {
       "id": "p4d-01",
       "title": "UITableView",
       "tier": "EXEC"
      },
      {
       "id": "p4d-02",
       "title": "UICollectionView",
       "tier": "EXEC"
      },
      {
       "id": "p4d-03",
       "title": "Cell reuse",
       "tier": "EXEC"
      },
      {
       "id": "p4d-04",
       "title": "Delegates and data sources",
       "tier": "EXEC"
      },
      {
       "id": "p4d-05",
       "title": "Diffable data sources",
       "tier": "EXEC"
      },
      {
       "id": "p4d-06",
       "title": "Compositional layout",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Large-list browser. A pagination-ready list with diff updates, stable identity and preserved scroll position."
     }
    },
    {
     "id": "p4e",
     "name": "Events and the run loop",
     "lessons": [
      {
       "id": "p4e-01",
       "title": "What an event loop is",
       "tier": "EXEC"
      },
      {
       "id": "p4e-02",
       "title": "The main run loop and its modes",
       "tier": "EXEC"
      },
      {
       "id": "p4e-03",
       "title": "UIResponder and the responder chain",
       "tier": "EXEC"
      },
      {
       "id": "p4e-04",
       "title": "First responder",
       "tier": "EXEC"
      },
      {
       "id": "p4e-05",
       "title": "Touch delivery",
       "tier": "EXEC"
      },
      {
       "id": "p4e-06",
       "title": "Hit-testing",
       "tier": "EXEC"
      },
      {
       "id": "p4e-07",
       "title": "Gesture recognizers and target-action",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Event inspector. Custom views that log and demonstrate hit-testing and responder-chain behaviour."
     }
    },
    {
     "id": "p4f",
     "name": "Rendering, animation and accessibility",
     "lessons": [
      {
       "id": "p4f-01",
       "title": "UIView vs CALayer",
       "tier": "EXEC"
      },
      {
       "id": "p4f-02",
       "title": "The Core Animation layer tree",
       "tier": "EXEC"
      },
      {
       "id": "p4f-03",
       "title": "Layout, display, compositing",
       "tier": "DOC"
      },
      {
       "id": "p4f-04",
       "title": "CPU vs GPU responsibilities",
       "tier": "DOC"
      },
      {
       "id": "p4f-05",
       "title": "Offscreen rendering",
       "tier": "DEV"
      },
      {
       "id": "p4f-06",
       "title": "draw(_:) and Core Graphics",
       "tier": "EXEC"
      },
      {
       "id": "p4f-07",
       "title": "Animation: two layers, one lie",
       "tier": "EXEC"
      },
      {
       "id": "p4f-08",
       "title": "VoiceOver and Dynamic Type",
       "tier": "DEV"
      }
     ],
     "project": {
      "brief": "Accessible animated interface. Custom animation and drawing with correct VoiceOver semantics and a performance inspection."
     }
    },
    {
     "id": "p4g",
     "name": "Design fundamentals",
     "lessons": [
      {
       "id": "p4g-01",
       "title": "The point is not the pixel",
       "tier": "EXEC"
      },
      {
       "id": "p4g-02",
       "title": "The spacing scale",
       "tier": "EXEC"
      },
      {
       "id": "p4g-03",
       "title": "The type scale, and Dynamic Type",
       "tier": "EXEC"
      },
      {
       "id": "p4g-04",
       "title": "Colour, contrast, and the two themes",
       "tier": "EXEC"
      },
      {
       "id": "p4g-05",
       "title": "Material, elevation, and what a shadow costs",
       "tier": "EXEC"
      },
      {
       "id": "p4g-06",
       "title": "Icons and SF Symbols",
       "tier": "EXEC"
      },
      {
       "id": "p4g-07",
       "title": "Images, and the decode tax",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Design token sheet. Build one screen twice: once with ad-hoc numbers, once from a spacing and type scale you defined. Measure both against Dynamic Type at the largest setting and show which one survives."
     }
    },
    {
     "id": "p4h",
     "name": "Composition and components",
     "lessons": [
      {
       "id": "p4h-01",
       "title": "Reading a screen as a tree",
       "tier": "EXEC"
      },
      {
       "id": "p4h-02",
       "title": "Stacks are the decomposition tool",
       "tier": "EXEC"
      },
      {
       "id": "p4h-03",
       "title": "The component, and its states",
       "tier": "EXEC"
      },
      {
       "id": "p4h-04",
       "title": "Lists, rhythm, and the repeated row",
       "tier": "EXEC"
      },
      {
       "id": "p4h-05",
       "title": "The five screen states: loading, loaded, empty, error, offline",
       "tier": "EXEC"
      },
      {
       "id": "p4h-06",
       "title": "Touch targets and reachability",
       "tier": "EXEC"
      },
      {
       "id": "p4h-07",
       "title": "When a design system earns its keep",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Screen teardown and rebuild. Take a screenshot of a screen you did not design. Draw its view tree, name every component and state, then rebuild it from your own tokens without looking at the original while you code."
     }
    },
    {
     "id": "p4i",
     "name": "Interface Builder and localization",
     "lessons": [
      {
       "id": "p4i-01",
       "title": "What a storyboard actually is",
       "tier": "EXEC"
      },
      {
       "id": "p4i-02",
       "title": "Segues vs manual instantiation",
       "tier": "EXEC"
      },
      {
       "id": "p4i-03",
       "title": "XIBs, reusable views, and File's Owner",
       "tier": "EXEC"
      },
      {
       "id": "p4i-04",
       "title": "Storyboards at scale, and the merge conflict",
       "tier": "EXEC"
      },
      {
       "id": "p4i-05",
       "title": "Traits and size classes",
       "tier": "EXEC"
      },
      {
       "id": "p4i-06",
       "title": "Localization under the hood: tables, plurals, direction",
       "tier": "EXEC"
      },
      {
       "id": "p4i-07",
       "title": "Switching language at runtime",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Two-language screen. One storyboard screen, fully localized, including a plural rule and a right-to-left language, switching language without an app restart."
     }
    }
   ],
   "capstone": {
    "brief": "UIKit Application. A polished multi-screen app with adaptive layout, lists, navigation, accessibility, custom interaction and Instruments checks."
   }
  },
  {
   "id": "p5",
   "name": "Concurrency",
   "purpose": "",
   "questions": [
    "Task or thread?",
    "Blocking or suspension?",
    "What mutable state is shared?",
    "What ordering is guaranteed?",
    "How do cancellation, errors and isolation propagate?"
   ],
   "chapters": [
    {
     "id": "p5a",
     "name": "Execution fundamentals",
     "lessons": [
      {
       "id": "p5a-01",
       "title": "Concurrency vs parallelism",
       "tier": "EXEC"
      },
      {
       "id": "p5a-02",
       "title": "Synchronous vs asynchronous",
       "tier": "EXEC"
      },
      {
       "id": "p5a-03",
       "title": "Thread vs task",
       "tier": "EXEC"
      },
      {
       "id": "p5a-04",
       "title": "Blocking vs suspension",
       "tier": "EXEC"
      },
      {
       "id": "p5a-05",
       "title": "Race conditions and data races",
       "tier": "EXEC"
      },
      {
       "id": "p5a-06",
       "title": "Deadlock, livelock, starvation",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Race and freeze lab. Freeze the UI on purpose, create an ordering bug and a race, then explain each failure."
     }
    },
    {
     "id": "p5b",
     "name": "GCD",
     "lessons": [
      {
       "id": "p5b-01",
       "title": "DispatchQueue",
       "tier": "EXEC"
      },
      {
       "id": "p5b-02",
       "title": "Serial vs concurrent queues",
       "tier": "EXEC"
      },
      {
       "id": "p5b-03",
       "title": "The main and global queues",
       "tier": "EXEC"
      },
      {
       "id": "p5b-04",
       "title": "async vs sync",
       "tier": "EXEC"
      },
      {
       "id": "p5b-05",
       "title": "Quality of service",
       "tier": "EXEC"
      },
      {
       "id": "p5b-06",
       "title": "Groups, semaphores and barriers",
       "tier": "EXEC"
      },
      {
       "id": "p5b-07",
       "title": "Why main.sync deadlocks",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Legacy concurrency project. An image or data pipeline built on queues with a safe handoff to the UI."
     }
    },
    {
     "id": "p5c",
     "name": "async/await and Task",
     "lessons": [
      {
       "id": "p5c-01",
       "title": "async functions",
       "tier": "EXEC"
      },
      {
       "id": "p5c-02",
       "title": "await is a suspension point",
       "tier": "EXEC"
      },
      {
       "id": "p5c-03",
       "title": "async throws",
       "tier": "EXEC"
      },
      {
       "id": "p5c-04",
       "title": "Task",
       "tier": "EXEC"
      },
      {
       "id": "p5c-05",
       "title": "Task lifetime",
       "tier": "EXEC"
      },
      {
       "id": "p5c-06",
       "title": "Cancellation is cooperative",
       "tier": "EXEC"
      },
      {
       "id": "p5c-07",
       "title": "Priorities and sleep",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Cancellable API screen. Loading, error, retry and cancel behaviour with navigation-safe task lifetime."
     }
    },
    {
     "id": "p5d",
     "name": "Structured concurrency",
     "lessons": [
      {
       "id": "p5d-01",
       "title": "Parent and child tasks",
       "tier": "EXEC"
      },
      {
       "id": "p5d-02",
       "title": "async let",
       "tier": "EXEC"
      },
      {
       "id": "p5d-03",
       "title": "Task groups",
       "tier": "EXEC"
      },
      {
       "id": "p5d-04",
       "title": "How errors and cancellation propagate",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Concurrent downloader. Fetch a dynamic set of resources with bounded reasoning about completion and failure."
     }
    },
    {
     "id": "p5e",
     "name": "Actors and isolation",
     "lessons": [
      {
       "id": "p5e-01",
       "title": "Actors",
       "tier": "EXEC"
      },
      {
       "id": "p5e-02",
       "title": "Actor isolation",
       "tier": "EXEC"
      },
      {
       "id": "p5e-03",
       "title": "Reentrancy",
       "tier": "EXEC"
      },
      {
       "id": "p5e-04",
       "title": "MainActor",
       "tier": "EXEC"
      },
      {
       "id": "p5e-05",
       "title": "nonisolated",
       "tier": "EXEC"
      },
      {
       "id": "p5e-06",
       "title": "Sendable and the Swift 6 checks",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Thread-safe cache. Start with unsafe mutable state, demonstrate the bug, then fix it with actor isolation."
     }
    },
    {
     "id": "p5f",
     "name": "Streams and bridging",
     "lessons": [
      {
       "id": "p5f-01",
       "title": "AsyncSequence",
       "tier": "EXEC"
      },
      {
       "id": "p5f-02",
       "title": "AsyncStream",
       "tier": "EXEC"
      },
      {
       "id": "p5f-03",
       "title": "Continuations",
       "tier": "EXEC"
      },
      {
       "id": "p5f-04",
       "title": "Migrating completion handlers",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Event-stream adapter. Wrap a callback or notification stream as an AsyncSequence and consume it safely."
     }
    }
   ],
   "capstone": {
    "brief": "Concurrency Workbench. A UIKit app with parallel network work, cancellation, an actor-protected cache, streaming updates, error propagation and a thread analysis."
   }
  },
  {
   "id": "p6",
   "name": "Networking",
   "purpose": "",
   "questions": [
    "Which protocol layer is responsible?",
    "What bytes, headers and status actually crossed?",
    "What is retryable and what is not?",
    "Where should caching, auth and cancellation live?"
   ],
   "chapters": [
    {
     "id": "p6a",
     "name": "Network foundations",
     "lessons": [
      {
       "id": "p6a-01",
       "title": "Packets",
       "tier": "DOC"
      },
      {
       "id": "p6a-02",
       "title": "IP addresses",
       "tier": "EXEC"
      },
      {
       "id": "p6a-03",
       "title": "Ports",
       "tier": "EXEC"
      },
      {
       "id": "p6a-04",
       "title": "DNS",
       "tier": "EXEC"
      },
      {
       "id": "p6a-05",
       "title": "TCP: the pipe under HTTP",
       "tier": "EXEC"
      },
      {
       "id": "p6a-06",
       "title": "UDP, and when it wins",
       "tier": "EXEC"
      },
      {
       "id": "p6a-07",
       "title": "Latency vs bandwidth",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Network trace notebook. Follow one hostname from DNS lookup to an open socket, with captured evidence at each step."
     }
    },
    {
     "id": "p6b",
     "name": "TLS and HTTP",
     "lessons": [
      {
       "id": "p6b-01",
       "title": "What TLS is for",
       "tier": "EXEC"
      },
      {
       "id": "p6b-02",
       "title": "Certificates and the chain",
       "tier": "EXEC"
      },
      {
       "id": "p6b-03",
       "title": "The handshake, and what it costs",
       "tier": "EXEC"
      },
      {
       "id": "p6b-04",
       "title": "Request and response",
       "tier": "EXEC"
      },
      {
       "id": "p6b-05",
       "title": "Methods",
       "tier": "EXEC"
      },
      {
       "id": "p6b-06",
       "title": "Status codes",
       "tier": "EXEC"
      },
      {
       "id": "p6b-07",
       "title": "Headers and body",
       "tier": "EXEC"
      },
      {
       "id": "p6b-08",
       "title": "Caching headers",
       "tier": "EXEC"
      },
      {
       "id": "p6b-09",
       "title": "Cookies, tokens, and idempotency",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "HTTP laboratory. Issue requests, inspect headers, status, body and cache behaviour, and classify every failure you can produce."
     }
    },
    {
     "id": "p6c",
     "name": "URLSession and decoding",
     "lessons": [
      {
       "id": "p6c-01",
       "title": "URL and URLRequest",
       "tier": "EXEC"
      },
      {
       "id": "p6c-02",
       "title": "URLSession and its configurations",
       "tier": "EXEC"
      },
      {
       "id": "p6c-03",
       "title": "The async URLSession APIs",
       "tier": "EXEC"
      },
      {
       "id": "p6c-04",
       "title": "Codable",
       "tier": "EXEC"
      },
      {
       "id": "p6c-05",
       "title": "Inside JSONDecoder",
       "tier": "EXEC"
      },
      {
       "id": "p6c-06",
       "title": "Decoding resilience",
       "tier": "EXEC"
      },
      {
       "id": "p6c-07",
       "title": "Timeouts and cancellation",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Typed API client. An endpoint abstraction with decoding, a typed error model and working cancellation."
     }
    },
    {
     "id": "p6d",
     "name": "Production networking",
     "lessons": [
      {
       "id": "p6d-01",
       "title": "Pagination",
       "tier": "EXEC"
      },
      {
       "id": "p6d-02",
       "title": "Retries and backoff",
       "tier": "EXEC"
      },
      {
       "id": "p6d-03",
       "title": "Rate limits",
       "tier": "EXEC"
      },
      {
       "id": "p6d-04",
       "title": "Auth refresh and the single flight",
       "tier": "EXEC"
      },
      {
       "id": "p6d-05",
       "title": "Request deduplication",
       "tier": "EXEC"
      },
      {
       "id": "p6d-06",
       "title": "Where caching belongs",
       "tier": "EXEC"
      },
      {
       "id": "p6d-07",
       "title": "Offline behaviour",
       "tier": "EXEC"
      },
      {
       "id": "p6d-08",
       "title": "WebSockets and background transfer",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Resilient feed. A paginated UI with a retry policy, deduplication, auth handling and cache integration."
     }
    },
    {
     "id": "p6e",
     "name": "Protocols on the wire",
     "lessons": [
      {
       "id": "p6e-01",
       "title": "Protocol Buffers: the wire format",
       "tier": "EXEC"
      },
      {
       "id": "p6e-02",
       "title": ".proto evolution: changing the contract safely",
       "tier": "EXEC"
      },
      {
       "id": "p6e-03",
       "title": "HTTP/2: frames, streams, multiplexing",
       "tier": "EXEC"
      },
      {
       "id": "p6e-04",
       "title": "Anatomy of a gRPC call",
       "tier": "EXEC"
      },
      {
       "id": "p6e-05",
       "title": "Deadlines and cancellation",
       "tier": "EXEC"
      },
      {
       "id": "p6e-06",
       "title": "Streaming RPCs and flow control",
       "tier": "EXEC"
      },
      {
       "id": "p6e-07",
       "title": "Interceptors",
       "tier": "EXEC"
      },
      {
       "id": "p6e-08",
       "title": "SwiftNIO and transports",
       "tier": "EXEC"
      },
      {
       "id": "p6e-09",
       "title": "TLS and certificate pinning",
       "tier": "EXEC"
      },
      {
       "id": "p6e-10",
       "title": "Connection lifecycle: keepalive, backoff, waiters",
       "tier": "EXEC"
      },
      {
       "id": "p6e-11",
       "title": "Auth over gRPC: tokens, refresh, single flight",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Wire inspector. Encode one message by hand, verify it byte for byte against the library's output, then capture the HTTP/2 frames that carry it."
     }
    }
   ],
   "capstone": {
    "brief": "Production API Layer. A reusable network package plus a client app with auth, pagination, caching, backoff, cancellation, tests and logging. Where the app speaks both REST and gRPC, they share one token vault."
   }
  },
  {
   "id": "p7",
   "name": "Persistence and Databases",
   "purpose": "",
   "questions": [
    "What survives process death?",
    "What consistency guarantee is needed?",
    "What does this index or cache optimize, and what does it cost?",
    "How is stale data invalidated?"
   ],
   "chapters": [
    {
     "id": "p7a",
     "name": "Files and serialization",
     "lessons": [
      {
       "id": "p7a-01",
       "title": "Volatile vs persistent",
       "tier": "EXEC"
      },
      {
       "id": "p7a-02",
       "title": "Files and directories",
       "tier": "EXEC"
      },
      {
       "id": "p7a-03",
       "title": "Serialization formats",
       "tier": "EXEC"
      },
      {
       "id": "p7a-04",
       "title": "Atomic writes",
       "tier": "EXEC"
      },
      {
       "id": "p7a-05",
       "title": "Corruption, and recovering from it",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "File-backed store. Serialize models with atomic replacement and handle a corrupted file without losing the good data."
     }
    },
    {
     "id": "p7b",
     "name": "Relational database fundamentals",
     "lessons": [
      {
       "id": "p7b-01",
       "title": "Why databases exist",
       "tier": "DOC"
      },
      {
       "id": "p7b-02",
       "title": "Tables, rows, relations",
       "tier": "EXEC"
      },
      {
       "id": "p7b-03",
       "title": "Primary and foreign keys",
       "tier": "EXEC"
      },
      {
       "id": "p7b-04",
       "title": "SQL basics",
       "tier": "EXEC"
      },
      {
       "id": "p7b-05",
       "title": "Indexes",
       "tier": "EXEC"
      },
      {
       "id": "p7b-06",
       "title": "Query plans",
       "tier": "EXEC"
      },
      {
       "id": "p7b-07",
       "title": "Transactions",
       "tier": "EXEC"
      },
      {
       "id": "p7b-08",
       "title": "ACID and normalization",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "SQLite notebook. A schema, CRUD, an indexed search you can time against an unindexed one, and a transaction rolled back on purpose."
     }
    },
    {
     "id": "p7c",
     "name": "Apple persistence",
     "lessons": [
      {
       "id": "p7c-01",
       "title": "SQLite under Core Data",
       "tier": "EXEC"
      },
      {
       "id": "p7c-02",
       "title": "The Core Data stack",
       "tier": "EXEC"
      },
      {
       "id": "p7c-03",
       "title": "Managed objects and faulting",
       "tier": "EXEC"
      },
      {
       "id": "p7c-04",
       "title": "Contexts and threads",
       "tier": "EXEC"
      },
      {
       "id": "p7c-05",
       "title": "Fetching, and NSFetchedResultsController",
       "tier": "EXEC"
      },
      {
       "id": "p7c-06",
       "title": "Migrations",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Persistent catalog app. An Apple persistence stack with migration-aware modeling and a migration you actually run."
     }
    },
    {
     "id": "p7d",
     "name": "Caching and offline design",
     "lessons": [
      {
       "id": "p7d-01",
       "title": "Cache hit and miss",
       "tier": "EXEC"
      },
      {
       "id": "p7d-02",
       "title": "Memory vs disk cache",
       "tier": "EXEC"
      },
      {
       "id": "p7d-03",
       "title": "NSCache and the decode tax",
       "tier": "EXEC"
      },
      {
       "id": "p7d-04",
       "title": "TTL",
       "tier": "EXEC"
      },
      {
       "id": "p7d-05",
       "title": "Invalidation",
       "tier": "EXEC"
      },
      {
       "id": "p7d-06",
       "title": "Stale-while-revalidate",
       "tier": "EXEC"
      },
      {
       "id": "p7d-07",
       "title": "LRU, and offline-first",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Offline-first repository. Memory plus disk plus API, with stale data, revalidation, mutation invalidation and a stated failure policy."
     }
    }
   ],
   "capstone": {
    "brief": "Offline-First Data App. Database, two-level cache, repository abstraction, migrations, offline reads, invalidation and tests."
   }
  },
  {
   "id": "p8",
   "name": "Software Engineering",
   "purpose": "",
   "questions": [
    "What responsibility belongs here?",
    "Which way do the dependencies point?",
    "How can this be tested or replaced?",
    "Which tradeoff makes the design simpler or safer?"
   ],
   "chapters": [
    {
     "id": "p8a",
     "name": "Clean design and SOLID",
     "lessons": [
      {
       "id": "p8a-01",
       "title": "Separation of concerns",
       "tier": "DOC"
      },
      {
       "id": "p8a-02",
       "title": "Cohesion and coupling",
       "tier": "EXEC"
      },
      {
       "id": "p8a-03",
       "title": "Single responsibility",
       "tier": "EXEC"
      },
      {
       "id": "p8a-04",
       "title": "Open/closed",
       "tier": "EXEC"
      },
      {
       "id": "p8a-05",
       "title": "Liskov substitution",
       "tier": "EXEC"
      },
      {
       "id": "p8a-06",
       "title": "Interface segregation",
       "tier": "EXEC"
      },
      {
       "id": "p8a-07",
       "title": "Dependency inversion",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Refactor challenge. Turn a massive view controller into focused, testable components without changing behaviour."
     }
    },
    {
     "id": "p8b",
     "name": "Architecture and state",
     "lessons": [
      {
       "id": "p8b-01",
       "title": "MVC, and the massive view controller",
       "tier": "EXEC"
      },
      {
       "id": "p8b-02",
       "title": "MVVM",
       "tier": "EXEC"
      },
      {
       "id": "p8b-03",
       "title": "Coordinator",
       "tier": "EXEC"
      },
      {
       "id": "p8b-04",
       "title": "Repository",
       "tier": "EXEC"
      },
      {
       "id": "p8b-05",
       "title": "Explicit screen state",
       "tier": "EXEC"
      },
      {
       "id": "p8b-06",
       "title": "State machines",
       "tier": "EXEC"
      },
      {
       "id": "p8b-07",
       "title": "Derived state, and boolean explosion",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Feature architecture project. One feature with explicit state, owned navigation and a repository boundary."
     }
    },
    {
     "id": "p8c",
     "name": "Dependency injection and patterns",
     "lessons": [
      {
       "id": "p8c-01",
       "title": "Constructor injection",
       "tier": "EXEC"
      },
      {
       "id": "p8c-02",
       "title": "Protocols as seams",
       "tier": "EXEC"
      },
      {
       "id": "p8c-03",
       "title": "Factories",
       "tier": "EXEC"
      },
      {
       "id": "p8c-04",
       "title": "Containers",
       "tier": "EXEC"
      },
      {
       "id": "p8c-05",
       "title": "Delegate, observer, strategy, adapter",
       "tier": "EXEC"
      },
      {
       "id": "p8c-06",
       "title": "The singleton tradeoff",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Dependency composition root. Wire production and fake implementations without a service locator."
     }
    },
    {
     "id": "p8d",
     "name": "Testing",
     "lessons": [
      {
       "id": "p8d-01",
       "title": "What a unit test actually is",
       "tier": "EXEC"
      },
      {
       "id": "p8d-02",
       "title": "Fakes, stubs and mocks",
       "tier": "EXEC"
      },
      {
       "id": "p8d-03",
       "title": "XCTest",
       "tier": "EXEC"
      },
      {
       "id": "p8d-04",
       "title": "Testing async code",
       "tier": "EXEC"
      },
      {
       "id": "p8d-05",
       "title": "UI tests",
       "tier": "DEV"
      },
      {
       "id": "p8d-06",
       "title": "What not to test",
       "tier": "DOC"
      }
     ],
     "project": {
      "brief": "Test harness. Tests for a view model, a repository, and every state transition and error path."
     }
    },
    {
     "id": "p8e",
     "name": "Modularization and teamwork",
     "lessons": [
      {
       "id": "p8e-01",
       "title": "Targets and modules",
       "tier": "EXEC"
      },
      {
       "id": "p8e-02",
       "title": "Swift Package Manager",
       "tier": "EXEC"
      },
      {
       "id": "p8e-03",
       "title": "Access control boundaries",
       "tier": "EXEC"
      },
      {
       "id": "p8e-04",
       "title": "Dependency direction",
       "tier": "EXEC"
      },
      {
       "id": "p8e-05",
       "title": "Git fundamentals",
       "tier": "EXEC"
      },
      {
       "id": "p8e-06",
       "title": "Merge vs rebase, and code review",
       "tier": "EXEC"
      },
      {
       "id": "p8e-07",
       "title": "CI/CD",
       "tier": "EXEC"
      },
      {
       "id": "p8e-08",
       "title": "Feature flags and environment config",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Modularize an app. Extract core, network and feature packages and write down the dependency rules they must obey."
     }
    },
    {
     "id": "p8f",
     "name": "Debugging, performance and observability",
     "lessons": [
      {
       "id": "p8f-01",
       "title": "The debugger",
       "tier": "EXEC"
      },
      {
       "id": "p8f-02",
       "title": "The Memory Graph",
       "tier": "DEV"
      },
      {
       "id": "p8f-03",
       "title": "Time Profiler",
       "tier": "DEV"
      },
      {
       "id": "p8f-04",
       "title": "Allocations and Leaks",
       "tier": "EXEC"
      },
      {
       "id": "p8f-05",
       "title": "Structured logging",
       "tier": "EXEC"
      },
      {
       "id": "p8f-06",
       "title": "Crash reports and symbolication",
       "tier": "EXEC"
      },
      {
       "id": "p8f-07",
       "title": "Metrics, and the analytics boundary",
       "tier": "DOC"
      }
     ],
     "project": {
      "brief": "Performance clinic. Diagnose and fix an intentionally slow, leaky screen, with before-and-after evidence."
     }
    }
   ],
   "capstone": {
    "brief": "Production Refactor. Take a medium app from tightly coupled code to a modular, testable architecture with tests and profiling notes."
   }
  },
  {
   "id": "p9",
   "name": "Apple Platform Internals",
   "purpose": "Useful once the earlier layers are comfortable. The goal is conceptual fluency, not kernel development.",
   "questions": [
    "Which Apple subsystem is involved?",
    "What observable behaviour proves the model?",
    "Where is the line between documented API and implementation detail?",
    "Which tool validates the hypothesis?"
   ],
   "chapters": [
    {
     "id": "p9a",
     "name": "Darwin/XNU and the process model",
     "lessons": [
      {
       "id": "p9a-01",
       "title": "Darwin and XNU",
       "tier": "DOC"
      },
      {
       "id": "p9a-02",
       "title": "Mach and BSD",
       "tier": "DOC"
      },
      {
       "id": "p9a-03",
       "title": "How an installed app becomes a process",
       "tier": "EXEC"
      },
      {
       "id": "p9a-04",
       "title": "The sandbox and containers",
       "tier": "EXEC"
      },
      {
       "id": "p9a-05",
       "title": "Entitlements",
       "tier": "EXEC"
      },
      {
       "id": "p9a-06",
       "title": "Code signing",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Platform map. Document how a signed app on disk becomes a sandboxed running process."
     }
    },
    {
     "id": "p9b",
     "name": "Loading and runtimes",
     "lessons": [
      {
       "id": "p9b-01",
       "title": "The app bundle",
       "tier": "EXEC"
      },
      {
       "id": "p9b-02",
       "title": "The binary and its frameworks",
       "tier": "EXEC"
      },
      {
       "id": "p9b-03",
       "title": "dyld and the shared cache",
       "tier": "EXEC"
      },
      {
       "id": "p9b-04",
       "title": "The Objective-C runtime in production",
       "tier": "EXEC"
      },
      {
       "id": "p9b-05",
       "title": "The Swift runtime and its metadata",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Launch trace. Binary to dyld to frameworks to runtime to the first scene, documented."
     }
    },
    {
     "id": "p9c",
     "name": "Run loop, GCD and lifecycle internals",
     "lessons": [
      {
       "id": "p9c-01",
       "title": "CFRunLoop",
       "tier": "EXEC"
      },
      {
       "id": "p9c-02",
       "title": "Dispatch internals",
       "tier": "DOC"
      },
      {
       "id": "p9c-03",
       "title": "The launch sequence",
       "tier": "DEV"
      },
      {
       "id": "p9c-04",
       "title": "Suspension and background execution",
       "tier": "EXEC"
      },
      {
       "id": "p9c-05",
       "title": "Memory pressure and jetsam in production",
       "tier": "DOC"
      }
     ],
     "project": {
      "brief": "Runtime behavior monitor. Timers, events, background transitions, lifecycle and memory observations in one app."
     }
    },
    {
     "id": "p9d",
     "name": "Rendering and diagnostics",
     "lessons": [
      {
       "id": "p9d-01",
       "title": "The Core Animation render server",
       "tier": "DOC"
      },
      {
       "id": "p9d-02",
       "title": "Compositing",
       "tier": "DEV"
      },
      {
       "id": "p9d-03",
       "title": "Instruments",
       "tier": "DEV"
      },
      {
       "id": "p9d-04",
       "title": "os_signpost",
       "tier": "EXEC"
      },
      {
       "id": "p9d-05",
       "title": "Reading a crash report",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Frame-to-pixel report. Profile an animated screen and explain the CPU, GPU and framework boundaries you measured."
     }
    },
    {
     "id": "p9e",
     "name": "The device's senses",
     "lessons": [
      {
       "id": "p9e-01",
       "title": "CoreLocation: permission as a state machine",
       "tier": "EXEC"
      },
      {
       "id": "p9e-02",
       "title": "Accuracy, privacy, and the reduced-accuracy path",
       "tier": "EXEC"
      },
      {
       "id": "p9e-03",
       "title": "Maps and geocoding: degrees, cameras, names",
       "tier": "EXEC"
      },
      {
       "id": "p9e-04",
       "title": "APNs from the socket up",
       "tier": "EXEC"
      },
      {
       "id": "p9e-05",
       "title": "Notification routing and service extensions",
       "tier": "DEV"
      },
      {
       "id": "p9e-06",
       "title": "LocalAuthentication and the Keychain gate",
       "tier": "EXEC"
      }
     ],
     "project": {
      "brief": "Sensor diagnostic screen. One screen that reports every permission state honestly, including the states you cannot reach without a device, and explains what the app should do in each."
     }
    }
   ],
   "capstone": {
    "brief": "iOS Internals Field Guide. Instrument a real app and produce a technical report tracing launch, events, concurrency, memory, rendering, signing and lifecycle."
   }
  }
 ]
};
