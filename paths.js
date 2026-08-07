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
       "read": "1. Start at the bottom: computers need physical states\n\nWhen we write software, we deal with abstractions. We write things like:\n\n```text\nlet age = 27\nlet isLoggedIn = true\nlet name = \"Hadi\"\n```\n\nBut a processor cannot directly manipulate the abstract ideas:\n\n```text\n27\ntrue\n\"Hadi\"\n```\n\nEventually, those ideas must be represented physically. A computer is an electronic machine. At the lowest level, its hardware can distinguish between physical states. Depending on the hardware technology, those states might involve things such as:\n\n• different voltage levels,\n• stored electrical charge,\n• transistor states,\n• magnetic orientation,\n• or other physical mechanisms.\n\nThe exact physical implementation depends on the hardware. The important idea is that the machine can reliably distinguish between two states. We represent those two states symbolically as:\n\n```text\n0\n1\n```\n\nThis is where the bit begins.\n\n2. What is a bit?\n\nA bit is short for:\n\n```text\nbinary digit\n```\n\nA bit has exactly two possible states:\n\n```text\n0\n1\n```\n\nSo one bit can distinguish between two possibilities. For example:\n\n```text\n0 → off\n1 → on\nOr:\n0 → false\n1 → true\nOr:\n0 → door closed\n1 → door open\n```\n\nThe bit itself does not inherently mean any of those things. The meaning depends on how software interprets it. A useful distinction is:\n\n0 and 1 are symbols we use to describe the two states. The actual computer stores some physical state that represents them. So bits are not merely mathematical ideas floating around inside the computer. Eventually, information must be encoded into physical hardware.\n\n3. One bit is not enough for very much\n\nSuppose you want to store whether a light is on. One bit is enough:\n\n```text\n0 → off\n1 → on\n```\n\nBut suppose you want four possibilities:\n\n```text\nred\ngreen\nblue\nyellow\n```\n\nOne bit cannot distinguish between four possibilities. It only gives you:\n\n```text\n0\n1\n```\n\ntwo patterns. So we combine bits. With two bits, the possible patterns are:\n\n```text\n00\n01\n10\n11\n```\n\nThere are four possibilities. Why? The first bit has two possible states. The second bit also has two possible states.\n\nTherefore:\n\n```text\n2 × 2 = 4\n```\n\npossible combinations. With three bits:\n\n```text\n2 × 2 × 2 = 8\n```\n\npossible combinations. Generally:\n\n```text\nn bits → 2ⁿ possible patterns\n```\n\nThis relationship is one of the most important ideas in computer science.\n\n4. Eight bits form a byte\n\nComputers constantly need groups of bits. One especially important group is the byte. A byte contains:\n\n```text\n8 bits\nExactly:\n1 byte = 8 bits\n```\n\nFor example, this is one byte:\n\n```text\n0 1 0 1 1 0 1 0\n```\n\nCount them:\n\n```text\n1 2 3 4 5 6 7 8\n```\n\nEight bits.\n\n5. Why exactly eight?\n\nThere is nothing in the laws of physics saying:\n\nThou shalt group bits into groups of eight. The size of a byte is a computing convention. Historically, different computer architectures used different byte sizes. A byte could sometimes mean a group containing a different number of bits.\n\nOver time, the industry converged on:\n\n```text\n1 byte = 8 bits\n```\n\nToday, an eight-bit byte is effectively universal in mainstream computing. Modern programming languages, operating systems, file formats, networking systems, and processors generally assume eight-bit bytes. Every example in this course assumes it too.\n\n6. A byte has 256 possible patterns\n\nWe already established:\n\n```text\nn bits → 2ⁿ possible patterns\n```\n\nA byte has eight bits. Therefore:\n\n```text\n2⁸ = 256\n```\n\nA byte has:\n\n```text\n256 distinct bit patterns\n```\n\nNotice carefully:\n\nA byte does not contain 256 bits. A byte contains:\n\n```text\n8 bits\n```\n\nThose eight bits can be arranged into:\n\n```text\n256 different patterns\n```\n\nThis distinction is extremely important. For example:\n\n```text\n00000000\n00000001\n00000010\n00000011\n```\n\n...\n\n```text\n11111111\n```\n\nThere are 256 such arrangements.\n\n7. Why an unsigned byte represents 0 through 255\n\nSuppose we decide to interpret those 256 patterns as non-negative integers. The first pattern can represent:\n\n```text\n0\n```\n\nThe next:\n\n```text\n1\n```\n\nThen:\n\n```text\n2\n```\n\nand so on. Since there are 256 patterns total, counting from zero gives:\n\n```text\n0 through 255\nbecause:\n0...255\n```\n\ncontains exactly 256 numbers. You can verify that with:\n\n```text\n255 - 0 + 1 = 256\n```\n\nThis is the range of an unsigned eight-bit integer:\n\n```text\nUInt8\nSo:\nUInt8 range = 0...255\n```\n\nWe are not discussing negative integers yet. Signed integers and two’s complement deserve their own lesson. For now, remember:\n\n```text\n8 bits\n→ 256 possible patterns\n→ if interpreted as unsigned numbers\n→ 0...255\n```\n\n8. What is a nibble?\n\nThere is another smaller unit you will occasionally encounter:\n\n```text\nnibble\n```\n\nA nibble is:\n\n```text\n4 bits\n```\n\nTherefore:\n\n```text\n1 nibble = 4 bits\n1 byte = 8 bits\n1 byte = 2 nibbles\n```\n\nFor example:\n\n```text\n1011 0110\ncan be visually separated into two nibbles:\n1011 0110\n^^^^ ^^^^\n4 bits 4 bits\n```\n\nWhy bother naming four bits? One major reason is hexadecimal. Later you will learn that:\n\n```text\n1 hexadecimal digit ↔ 4 bits\n```\n\nSo nibbles become convenient when reading things like:\n\n```text\n0xAF\n0x12\n0xFF\n```\n\nWe will not learn hexadecimal yet. For now, plant the relationship in your head:\n\n```text\nbit = 1 binary digit\nnibble = 4 bits\nbyte = 8 bits\n```\n\n9. Bit positions inside a byte\n\nConsider this byte:\n\n```text\n1 0 1 0 1 1 0 1\n```\n\nBits are usually numbered starting from zero. For an eight-bit value:\n\n```text\nbit 7 bit 0\n↓ ↓\n1 0 1 0 1 1 0 1\n```\n\nSo the bit positions are:\n\n```text\n7 6 5 4 3 2 1 0\n```\n\nThe rightmost bit is:\n\n```text\nbit 0\n```\n\nIt is called the least significant bit, or LSB. The leftmost bit in this eight-bit value is:\n\n```text\nbit 7\n```\n\nIt is the most significant bit, or MSB.\n\n10. Why does bit 0 matter?\n\nEach position corresponds to a power of two. For an eight-bit value:\n\n```text\nBit position: 7 6 5 4 3 2 1 0\nValue: 128 64 32 16 8 4 2 1\n```\n\nThese values come from:\n\n```text\n2⁷ = 128\n2⁶ = 64\n2⁵ = 32\n2⁴ = 16\n2³ = 8\n2² = 4\n2¹ = 2\n2⁰ = 1\n```\n\nWe are not doing a full binary-number lesson yet. But understanding the positions will help later when we learn:\n\n• binary conversion,\n• bit shifting,\n• bit masks,\n• flags,\n• permissions,\n• networking protocols,\n• graphics,\n• low-level APIs.\n\nFor now, just understand what the positions mean.\n\n11. Example: the value 173\n\nConsider:\n\n```text\n173\n```\n\nWe can construct it from powers of two:\n\n```text\n173 = 128 + 32 + 8 + 4 + 1\nUsing the bit positions:\n128 64 32 16 8 4 2 1\nmark the values we need:\n128 64 32 16 8 4 2 1\n1 0 1 0 1 1 0 1\n```\n\nSo 173 can be represented as:\n\n```text\n10101101\nRecover it:\n1 × 128 = 128\n0 × 64 = 0\n1 × 32 = 32\n0 × 16 = 0\n1 × 8 = 8\n1 × 4 = 4\n0 × 2 = 0\n1 × 1 = 1\n───\n173\n```\n\nAgain, don’t worry about becoming fast at binary conversion yet. The goal here is simply to see that the individual bit positions have meaning.\n\n12. Why do programmers talk about bytes so much?\n\nYou might wonder:\n\nIf computers ultimately use bits, why don’t we measure everything directly in bits? Because software and hardware need convenient chunks to work with. Modern mainstream computer memory is normally byte-addressable. That means:\n\nAn ordinary memory address identifies one byte. Imagine memory like a gigantic row of byte-sized boxes:\n\n```text\nAddress Contents\n0x1000 → 10101101\n0x1001 → 00110110\n0x1002 → 11110000\n0x1003 → 00001111\n```\n\nEach address selects one byte. The next address selects the next byte. Conceptually:\n\n```text\n0x1000\n0x1001\n0x1002\n0x1003\n```\n\nrepresent neighboring byte locations.\n\n13. Why not give every individual bit an address?\n\nImagine instead that every bit had its own address. Instead of:\n\n```text\naddress 100 → one byte\nyou might have:\naddress 100 → one bit\naddress 101 → one bit\naddress 102 → one bit\n```\n\n... This would make many normal memory operations much more awkward. Processors usually want to move and operate on groups of bits. For example:\n\n```text\n8 bits\n16 bits\n32 bits\n64 bits\n128 bits\n```\n\nWorking with a single isolated bit is often too small a unit for general-purpose storage and computation. So modern systems expose byte-sized addressable units. When software wants a particular bit, it normally:\n\n```text\n1. accesses the containing byte or larger value,\n```\n\n2. isolates the desired bit. Later, bit masks and bitwise operators will show exactly how that works.\n\n14. Byte-addressability is a design choice, not a law of nature\n\nBe careful with the statement:\n\nMemory is addressed in bytes. For modern systems like Apple’s platforms, that is a useful and correct mental model. But byte-addressability is not a fundamental law of computing. Different computer architectures can theoretically choose different addressable units.\n\nHistorically, some architectures did. So the precise statement is:\n\nModern mainstream architectures, including current Apple platforms, use byte-addressable memory. That distinction matters because we want to understand why systems are designed this way, rather than memorize conventions as if physics required them.\n\n15. How this appears in Swift\n\nSwift constantly exposes sizes in bytes. Consider:\n\n```text\nMemoryLayout<UInt8>.size\n```\n\nYou might guess it means:\n\nTell me how many bits UInt8 uses. It does not. The result is measured in:\n\n```text\nbytes\n```\n\nFor example:\n\n```text\nprint(MemoryLayout<UInt8>.size)\nprints:\n1\nbecause:\nUInt8\n= 8 bits\n= 1 byte\n```\n\n16. Fixed-width integer types\n\nSwift provides integer types whose width is explicitly part of their name:\n\n```text\nUInt8\nUInt16\nUInt32\nUInt64\n```\n\nThe number tells you the number of bits. Therefore:\n\n```text\nType Bits Bytes\nUInt8 8 1\nUInt16 16 2\nUInt32 32 4\nUInt64 64 8\nbecause:\n8 bits = 1 byte\nSo:\n16 / 8 = 2 bytes\n32 / 8 = 4 bytes\n64 / 8 = 8 bytes\n```\n\n17. The type controls the width\n\nConsider:\n\n```text\nlet a: UInt8 = 1\nlet b: UInt64 = 1\nBoth variables currently contain the mathematical value:\n1\n```\n\nBut they do not have the same width. a is:\n\n```text\nUInt8\nso its representation requires:\n8 bits\n= 1 byte\nb is:\nUInt64\nso its representation requires:\n64 bits\n= 8 bytes\n```\n\nEven though the value itself is tiny. This is an important principle:\n\nThe value determines what information is currently stored. The type determines how that information is represented and interpreted. Therefore:\n\n```text\nUInt64(1)\n```\n\ndoes not shrink itself down to one bit just because the mathematical number 1 could theoretically be expressed with one binary digit. Its type is still UInt64.\n\n18. Why fixed widths are useful\n\nWhy would Swift reserve 64 bits for a value that currently contains 1? Because fixed representations make computation predictable. A processor needs to know things such as:\n\n• how many bytes to read,\n• how many bytes to write,\n• what operations apply,\n• where the next value begins,\n• what range is available.\n\nImagine if every integer dynamically used only the minimum number of bits necessary. Then:\n\n```text\n1\n```\n\nmight require one bit. But:\n\n```text\n255\n```\n\nmight require eight bits. And:\n\n```text\n100000000000\n```\n\nwould require far more. The location and representation of every value could constantly change as the value changed. Fixed-width types avoid that complexity.\n\n19. Measuring type sizes with MemoryLayout\n\nSwift gives us:\n\n```text\nMemoryLayout<T>\n```\n\nFor now, we care about:\n\n```text\nMemoryLayout<T>.size\n```\n\nFor example:\n\n```text\nprint(MemoryLayout<UInt8>.size)\nprint(MemoryLayout<UInt16>.size)\nprint(MemoryLayout<UInt32>.size)\nprint(MemoryLayout<UInt64>.size)\n```\n\nExpected output:\n\n```text\n1\n2\n4\n8\n```\n\nAgain:\n\nThese values are bytes, not bits. So:\n\n```text\nMemoryLayout<UInt32>.size == 4\nmeans:\n4 bytes\nwhich equals:\n32 bits\n```\n\n20. What about Int?\n\nSwift also has:\n\n```text\nInt\nUInt\n```\n\nUnlike UInt32 or UInt64, the number of bits is not written in the type name. On current 64-bit Apple platforms:\n\n```text\nInt → 8 bytes\nUInt → 8 bytes\n```\n\nbecause they are 64-bit integer types on these systems. You can confirm:\n\n```text\nprint(MemoryLayout<Int>.size)\nprint(MemoryLayout<UInt>.size)\n```\n\nExpected on a modern iPhone, iPad, or Mac:\n\n```text\n8\n8\n```\n\nHistorically, this depended on the architecture. That is why you should understand that Int is a machine-sized integer type rather than assuming that Int conceptually always means exactly 64 bits on every computer ever built.\n\n21. A surprising case: Bool.\n\nA Boolean has only two logical possibilities.\n\n```text\nfalse\ntrue\n```\n\nInformation-theoretically, two possibilities can be represented by one bit.\n\n```text\n0\n1\n```\n\nSo you might predict.\n\n```text\nMemoryLayout<Bool>.size\nwould somehow report:\n1 bit\n```\n\nBut remember.\n\n```text\nMemoryLayout.size reports bytes.\nRun:\nprint(MemoryLayout<Bool>.size)\n```\n\nOn current Swift/Apple platforms, you will get.\n\n```text\n1\nmeaning:\n1 byte\n```\n\nnot one bit.\n\n22. Information requirement versus storage representation\n\nThis distinction is important. A Boolean needs only:\n\n```text\n2 possible states\nwhich mathematically requires:\n1 bit\n```\n\nof information. But Swift’s standalone Bool value occupies:\n\n```text\n1 byte\n```\n\nof storage representation. Therefore:\n\nThe minimum information required to express something is not necessarily equal to the amount of storage a language or machine uses to represent it. This principle appears everywhere in systems programming. Efficiency is often balanced against:\n\n• ease of addressing,\n• alignment,\n• performance,\n• processor architecture,\n• implementation simplicity.\n\nWe will revisit these ideas later.\n\n23. What MemoryLayout.size does NOT mean\n\nBe careful not to misunderstand:\n\n```text\nMemoryLayout<T>.size\nas:\n```\n\nTell me the total amount of RAM this thing and everything connected to it consumes. That is not what it means. For simple fixed-width value types, the interpretation is straightforward. For example:\n\n```text\nMemoryLayout<UInt64>.size\n```\n\nis clearly eight bytes. But things become more complicated with types such as:\n\n```text\nString\nArray\nDictionary\nclass instances\n```\n\nbecause these can reference additional storage elsewhere. For example:\n\n```text\nlet names = [\"A\", \"B\", \"C\", \"D\"]\n```\n\nThe Array value itself has some representation. But its elements may involve additional storage. So this:\n\n```text\nMemoryLayout.size(ofValue: names)\ndoes not mean:\n```\n\nTell me the complete amount of memory used by the entire array and everything associated with it. We will learn those distinctions later when we study:\n\n• stack and heap,\n• pointers,\n• reference types,\n• allocations,\n• value types,\n• copy-on-write.\n\nFor this lesson, just remember:\n\n```text\nMemoryLayout<T>.size measures the size of T’s value representation, in\n```\n\nbytes.\n\n24. Lowercase b versus uppercase B\n\nThere is a small notation rule that causes a lot of confusion:\n\n```text\nb = bits\nB = bytes\nSo:\nMb\nmeans:\nmegabits\nwhile:\nMB\nmeans:\nmegabytes\n```\n\nThese are not the same. Because:\n\n```text\n8 bits = 1 byte\nwe have, conceptually:\n8 megabits ≈ 1 megabyte\n```\n\ndepending on exactly which decimal/binary convention is being used. This distinction appears constantly with network speeds. For example, an internet connection might be advertised as:\n\n```text\n100 Mbps\n```\n\nThat means:\n\n```text\n100 megabits per second\nnot:\n100 megabytes per second\nIgnoring network overhead, divide by eight to get approximately:\n12.5 MB/s\n```\n\nThat is one reason a “100 Mbps” connection does not usually download a 100 MB file in one second.\n\n25. Bytes are everywhere in software\n\nFiles are commonly measured in bytes:\n\n```text\n500 B\n20 kB\n4 MB\n2 GB\n```\n\nMemory is measured in bytes. Downloads are measured in bytes. Network payloads are composed of bytes. Images require bytes for their pixel data.\n\nCaches use byte budgets. Disk capacities are measured in bytes. So even though the bit is the more fundamental unit, the byte is usually the more convenient software-facing unit.\n\n26. kB versus KiB\n\nThere is another source of confusion. You may have learned:\n\n```text\n1 KB = 1024 bytes\n```\n\nBut the modern standardized terminology distinguishes decimal and binary prefixes. Decimal:\n\n```text\n1 kB = 1,000 bytes\n1 MB = 1,000,000 bytes\n1 GB = 1,000,000,000 bytes\n```\n\nBinary:\n\n```text\n1 KiB = 1,024 bytes\n1 MiB = 1,048,576 bytes\n1 GiB = 1,073,741,824 bytes\n```\n\nThe i matters:\n\n```text\nkB → kilobyte\nKiB → kibibyte\nMB → megabyte\nMiB → mebibyte\n```\n\nWhy 1024? Because:\n\n```text\n1024 = 2¹⁰\n```\n\nwhich fits naturally into binary systems. Why 1000? Because the SI prefix:\n\n```text\nkilo\nmeans:\n1000\n```\n\nin the metric system.\n\n27. Why “KB means 1024 bytes” is ambiguous\n\nHistorically, people often used:\n\n```text\nKB\nto mean:\n1024 bytes\n```\n\nEven today, software sometimes uses the terms inconsistently. So when precision matters, write:\n\n```text\nkB = 1000 bytes\nKiB = 1024 bytes\nSimilarly:\nMB = 1,000,000 bytes\nMiB = 1,048,576 bytes\n```\n\nThis becomes particularly important when you calculate:\n\n• storage,\n• image buffers,\n• downloads,\n• memory budgets,\n• caches.\n\n28. A real byte budget: images\n\nLet’s connect this directly to iOS. Imagine an image that is:\n\n```text\n1920 × 1080 pixels\n```\n\nSuppose each pixel is represented using four bytes:\n\n```text\nRed → 1 byte\nGreen → 1 byte\nBlue → 1 byte\nAlpha → 1 byte\n```\n\nThis is commonly described as:\n\n```text\nRGBA\nSo:\n1 pixel = 4 bytes\nNumber of pixels:\n1920 × 1080\n= 2,073,600 pixels\nRaw pixel bytes:\n2,073,600 × 4\n= 8,294,400 bytes\n```\n\nThat’s approximately:\n\n```text\n8.29 MB\n```\n\nin decimal megabytes. In MiB:\n\n```text\n8,294,400 / 1,048,576\n≈ 7.91 MiB\n```\n\nSo one raw 1080p RGBA image requires roughly:\n\n```text\n7.91 MiB\n```\n\nof pixel storage.\n\n29. But my JPEG is only 600 KB\n\nThis often surprises developers. You might have a JPEG file that is only:\n\n```text\n600 kB\n```\n\non disk. Then you load it into an app. Why might the image use several megabytes in memory? Because the JPEG file is compressed.\n\nThe compressed file might contain a compact encoding of the image. When the image is decoded for display, the system may need a raw pixel buffer. Conceptually:\n\n```text\ncompressed JPEG\n↓\ndecoding\n↓\nraw pixels\nSo:\ndisk size ≠ raw pixel size\n```\n\nThis is extremely important in image-heavy apps.\n\n30. A 4K example\n\nConsider:\n\n```text\n3840 × 2160\n```\n\npixels. Total pixels:\n\n```text\n3840 × 2160\n= 8,294,400\n```\n\nAt four bytes per pixel:\n\n```text\n8,294,400 × 4\n= 33,177,600 bytes\n```\n\nConvert to MiB:\n\n```text\n33,177,600 / 1,048,576\n≈ 31.64 MiB\n```\n\nOne raw 4K RGBA buffer can therefore require roughly:\n\n```text\n31.6 MiB\n```\n\nNow imagine a scrolling feed holding ten such decoded images. Ignoring many other details, that could theoretically approach:\n\n```text\n316 MiB\n```\n\njust for those raw buffers. Suddenly, concepts such as:\n\n• image caching,\n• image resizing,\n• downsampling,\n• reuse,\n• lazy loading,\n• memory warnings,\n\nbegin to make much more sense. The low-level concept:\n\n```text\nbyte\n```\n\nhas reached all the way up to an iOS performance problem.\n\n31. Data in Swift is fundamentally about bytes\n\nSwift and Foundation frequently expose raw data using:\n\n```text\nData\n```\n\nFor example, a network request might return:\n\n```text\nData\n```\n\nYou can ask:\n\n```text\ndata.count\n```\n\nThat count represents:\n\n```text\nbytes\nIf:\ndata.count == 5_000_000\nthen the Data contains approximately:\n5 MB\n```\n\nusing decimal units. So when you work with:\n\n• HTTP responses,\n• images,\n• JSON payloads,\n• downloaded files,\n• uploads,\n• local caches,\n\nyou are constantly working with byte counts whether you consciously think about it or not.\n\n32. Connection downward: toward the machine\n\nLet’s trace this lesson downward. At the physical level:\n\n```text\nphysical system\n↓\ntwo distinguishable states\n↓\nbit\nBits are grouped:\nbits\n↓\n8 bits\n↓\nbyte\n```\n\nMemory exposes byte-addressable locations:\n\n```text\nbyte\n↓\nmemory address\n```\n\nThe CPU works with collections of these bits and bytes using registers, instructions, caches, memory buses, and other hardware structures. We will explore those mechanisms later. For now:\n\n```text\nphysical state\n↓\nbit\n↓\nbyte\n↓\naddressable memory\n```\n\n33. Connection upward: toward Swift and iOS\n\nNow go upward. A byte becomes useful as a programming abstraction.\n\n```text\nbyte\n↓\nUInt8\nGroups of bytes give us wider values:\n2 bytes → UInt16\n4 bytes → UInt32\n8 bytes → UInt64\n```\n\nSwift exposes those sizes.\n\n```text\nMemoryLayout<T>.size\nFoundation works directly with byte collections.\nData\n```\n\nThen application-level systems build on top.\n\n```text\nnetwork response\nimage\ncache\ndatabase record\nfile\nvideo\naudio\n```\n\nEventually, your iOS app encounters problems such as:\n\nWhy is this image consuming so much memory? Why is this cache 100 MB? Why is this API response huge? Why does this file download take so long?\n\nWhy does MemoryLayout report 8? Why does UInt64 occupy 8 bytes? All of those questions connect back to the concepts in this lesson.\n\n34. The full chain\n\nYou should now be able to mentally trace:\n\n```text\nphysical hardware state\n↓\nbit\n↓\n4 bits = nibble\n↓\n8 bits = byte\n↓\n256 possible byte patterns\n↓\nbyte-addressable memory\n↓\nfixed-width types\n↓\n```\n\nSwift MemoryLayout\n\n```text\n↓\nData / images / files / network payloads\n↓\nreal iOS memory and performance behavior\n```\n\nThis is the kind of connection we want to build throughout the course. Instead of memorizing:\n\n```text\nMemoryLayout<UInt64>.size == 8\n```\n\nyou should eventually be able to explain why the number 8 makes sense all the way down to the representation model of the machine.\n\n35. Before moving on\n\nSix distinctions from this lesson are easy to blur. Each already appeared above with its full derivation — this is the checklist, not a new explanation, and the same six items close out this lesson again in the points list below.\n\nBit versus byte. 1 bit is one binary state. 1 byte is 8 bits.\n\nEight bits versus 256 values. A byte contains 8 bits, not 256 bits. Those 8 bits can form 2⁸ = 256 different patterns.\n\nLogical information versus physical representation. A Boolean needs only 1 bit of information. A Swift `Bool` still occupies 1 byte of storage.\n\nValue versus type width. `UInt64(1)` holds the number 1, but its type keeps its width at 64 bits, which is 8 bytes.\n\nb versus B. Lowercase b means bit. Uppercase B means byte. So 8 Mb is not 8 MB.\n\nMB versus MiB. 1 MB is 1,000,000 bytes. 1 MiB is 1,048,576 bytes.",
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
         "prompt": "Do these without immediately looking back at the lesson. Write your answers down.\n\nDefine all three in your own words:\nbit\nnibble\nbyte\n\nState their exact relationships.",
         "answer": "A bit is a binary unit with two possible states, conventionally represented as 0 and 1. A nibble contains four bits. A byte contains eight bits, so one byte contains two nibbles.\n\n1 bit = 1 bit\n1 nibble = 4 bits\n1 byte = 8 bits = 2 nibbles"
        },
        {
         "type": "trace",
         "prompt": "Before running this code, predict every output. Also state what unit each output uses.",
         "answer": "Expected:\n1\n2\n1\n8\n\nThe unit is bytes.\n\nUInt8 → 1 byte\nUInt16 → 2 bytes\nBool → 1 byte\nUInt64 → 8 bytes",
         "code": "print(MemoryLayout<UInt8>.size)\nprint(MemoryLayout<UInt16>.size)\nprint(MemoryLayout<Bool>.size)\nprint(MemoryLayout<UInt64>.size)"
        },
        {
         "type": "reasoning",
         "prompt": "Why do modern computers normally give memory addresses to bytes rather than individual bits? What would conceptually change if every bit had its own address?",
         "answer": "Processors and software usually manipulate groups of bits rather than individual isolated bits. A byte is a much more practical minimum addressable storage unit for general-purpose computing. With bit-addressable memory, addresses would refer to individual bits. Accessing normal values consisting of 8, 16, 32, or 64 bits would require thinking about many more individually addressed units. In byte-addressable memory, one address identifies one byte, and software can load a byte or larger group and then use bit operations when individual bits are needed. Byte-addressability is an architectural design choice, not a law of physics."
        },
        {
         "type": "apply",
         "prompt": "How many distinct patterns can three bits represent? How many can twelve bits represent? Explain the reasoning instead of only writing the formula.",
         "answer": "Each bit has two possibilities. For three bits: 2 × 2 × 2 = 8 So three bits can form eight patterns. For twelve bits, there are twelve independent positions, each with two possibilities: 2 × 2 × 2 × ... twelve times = 2¹² = 4096 So twelve bits can form 4096 distinct patterns."
        },
        {
         "type": "reasoning",
         "prompt": "The mathematical value 1 could be represented with a single binary digit. Why does this Swift value still occupy eight bytes?",
         "answer": "Its storage width is determined by its type, not by how large its current value is. The type is: UInt64 which is a 64-bit fixed-width integer. Therefore its representation occupies: 64 bits = 8 bytes even when the current value happens to be 1.",
         "code": "let number = UInt64(1)"
        },
        {
         "type": "debug",
         "prompt": "A developer says: “A byte contains 256 bits. That’s why UInt8 can represent 0 through 255.” Identify and correct the mistake.",
         "answer": "A byte does not contain 256 bits. A byte contains exactly: 8 bits Since each bit has two possibilities, eight bits can form: 2⁸ = 256 distinct patterns. If those patterns are interpreted as unsigned integers, they can represent: 0...255 So 256 refers to the number of possible patterns, not the number of bits."
        },
        {
         "type": "explain",
         "prompt": "Without looking back, explain this entire chain. Then explain one thing that MemoryLayout.size does not measure.",
         "code": "physical state → bit → nibble → byte → memory address → Swift type width → MemoryLayout.size",
         "answer": "Computer hardware can distinguish physical states, which we represent as binary 0 and 1. One binary state is represented by a bit. Four bits form a nibble. Eight bits form a byte. Modern mainstream memory systems are generally byte-addressable, meaning an ordinary memory address identifies one byte. Swift types specify representations with particular widths. For example, UInt64 has a 64-bit, or eight-byte, representation. MemoryLayout<T>.size reports the size of T’s value representation in bytes. It does not generally calculate the complete amount of process memory consumed by everything associated with a value. For example, a collection may refer to additional dynamically allocated storage not represented by simply reading MemoryLayout.size."
        }
       ],
       "exercises": [
        {
         "brief": "Exercise 1 — Swift byte census Tier: EXEC Step 1 — Make predictions Create a Swift playground, executable project, or simple Swift file. Run:\n\n```text\nfunc inspect<T>(_ type: T.Type, name: String) {\n    let bytes = MemoryLayout<T>.size\n    let bits = bytes * 8\n    print(\"\\(name): \\(bytes) byte(s) = \\(bits) bits\")\n}\ninspect(UInt8.self, name: \"UInt8\")\ninspect(UInt16.self, name: \"UInt16\")\ninspect(UInt32.self, name: \"UInt32\")\ninspect(UInt64.self, name: \"UInt64\")\ninspect(Bool.self, name: \"Bool\")\ninspect(Int.self, name: \"Int\")\n```",
         "expected": "Step 3 — Expected output On a current 64-bit Apple platform, the important results should be:\n\n```text\nUInt8: 1 byte(s) = 8 bits\nUInt16: 2 byte(s) = 16 bits\nUInt32: 4 byte(s) = 32 bits\nUInt64: 8 byte(s) = 64 bits\nBool: 1 byte(s) = 8 bits\nInt: 8 byte(s) = 64 bits\n```",
         "done": [
          "Made predictions before running the program",
          "Ran the byte census in a Swift playground, executable project, or simple Swift file",
          "Compared the results with the expected output"
         ]
        },
        {
         "brief": "Exercise 2 — Build one byte by hand\n\nThe goal is to make an eight-bit value feel concrete rather than abstract.",
         "expected": "The completed pattern is 10101101. Converting that pattern back produces 173.",
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
         "brief": "Exercise 3 — Image-memory calculator Tier: EXEC Now use what you learned to build something relevant to iOS. Write a Swift function that receives:\n\n```text\nwidth\nheight\nbytes per pixel\nand calculates:\ntotal bytes\ndecimal MB\nbinary MiB\nStart with:\nfunc imageMemory(\n    width: Int,\n    height: Int,\n    bytesPerPixel: Int\n) {\n    // Your implementation\n}\nYour formulas are:\npixels = width × height\nbytes = pixels × bytesPerPixel\nMB = bytes / 1,000,000\nMiB = bytes / 1,048,576\n```\n\nBe careful with integer division. You will probably want to convert the byte count to Double before calculating MB and MiB.",
         "expected": "One possible implementation Only look at this after attempting it yourself.\n\n```text\nfunc imageMemory(\n    width: Int,\n    height: Int,\n    bytesPerPixel: Int\n) {\n    let totalPixels = width * height\n    let totalBytes = totalPixels * bytesPerPixel\n    let mb = Double(totalBytes) / 1_000_000\n    let mib = Double(totalBytes) / 1_048_576\n    print(\"Resolution: \\(width) × \\(height)\")\n    print(\"Pixels: \\(totalPixels)\")\n    print(\"Bytes per pixel: \\(bytesPerPixel)\")\n    print(\"Total bytes: \\(totalBytes)\")\n    print(\"MB: \\(mb)\")\n    print(\"MiB: \\(mib)\")\n}\nRun three cases\nRun:\nimageMemory(\n    width: 640,\n    height: 480,\n    bytesPerPixel: 4\n)\nThen:\nimageMemory(\n    width: 1920,\n    height: 1080,\n    bytesPerPixel: 4\n)\nThen:\nimageMemory(\n    width: 3840,\n    height: 2160,\n    bytesPerPixel: 4\n)\nBefore running each one:\n```\n\nWrite down your prediction. It does not have to be exact. The point is to develop intuition. Deliberately make one wrong estimate Before running the 4K case, make a rough guess such as:\n\n```text\n\"I think a 4K RGBA image will use around 8 MB.\"\n```\n\nThen run the calculation. You should discover that the raw buffer is approximately:\n\n```text\n33,177,600 bytes\n33.18 MB\n31.64 MiB\n```\n\nNow explain why your estimate was wrong. A strong explanation might be:\n\nI underestimated how quickly pixel count grows. A 4K image contains more than eight million pixels, and each RGBA pixel requires four bytes, producing more than 33 million raw bytes. Extension challenge Imagine a collection view currently holding decoded buffers for:\n\n```text\n20 images\nand every image is:\n1920 × 1080 RGBA\n```\n\nIgnore every other memory cost. Estimate the raw pixel storage. One image:\n\n```text\n8,294,400 bytes\nTwenty:\n8,294,400 × 20\n= 165,888,000 bytes\nThat’s roughly:\n165.9 MB\nor:\n158.2 MiB\nNow ask:\n```\n\nWhy might blindly caching full-resolution decoded images become dangerous in an iOS app? You should already be able to give a meaningful systems-level answer.",
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
       "tier": "EXEC"
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
