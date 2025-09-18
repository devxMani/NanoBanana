import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("API: Starting image generation request")

    const formData = await request.formData()
    const mode = formData.get("mode") as string
    const prompt = formData.get("prompt") as string

    console.log("API: Mode:", mode)
    console.log("API: Prompt:", prompt)

    if (!mode || !prompt) {
      console.log("API: Missing required fields")
      return NextResponse.json({ error: "Mode and prompt are required" }, { status: 400 })
    }

    if (mode === "text-to-image") {
      console.log("API: Using Pollinations.ai (completely free, no API key needed)")

      // Using Pollinations.ai - completely free, no API key required
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&enhance=true`
      
      console.log("API: Generated image URL:", imageUrl)

      // Test if the image URL is accessible
      try {
        const testResponse = await fetch(imageUrl, { method: 'HEAD' })
        if (!testResponse.ok) {
          throw new Error(`Image generation failed: ${testResponse.status}`)
        }
      } catch (error) {
        console.error("API: Error testing image URL:", error)
        return NextResponse.json({
          error: "Failed to generate image",
          details: "Image service unavailable"
        }, { status: 500 })
      }

      return NextResponse.json({
        url: imageUrl,
        prompt: prompt,
        description: `Generated image for: ${prompt}`,
      })
    } else if (mode === "image-editing") {
      return NextResponse.json(
        { error: "Image editing not yet implemented" }, 
        { status: 501 }
      )
    } else {
      console.log("API: Invalid mode:", mode)
      return NextResponse.json({ error: "Invalid mode. Must be 'text-to-image'" }, { status: 400 })
    }

  } catch (error) {
    console.error("API: Error generating image:", error)
    console.error("API: Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
