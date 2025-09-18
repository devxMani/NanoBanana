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
      console.log("API: Using Hugging Face Stable Diffusion")

      // Using Hugging Face Inference API (Free)
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          headers: {
            "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: prompt,
            options: {
              wait_for_model: true,
            }
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`)
      }

      const imageBlob = await response.blob()
      const imageBuffer = await imageBlob.arrayBuffer()
      const base64Image = Buffer.from(imageBuffer).toString('base64')
      const imageUrl = `data:image/jpeg;base64,${base64Image}`

      console.log("API: Image generated successfully")

      return NextResponse.json({
        url: imageUrl,
        prompt: prompt,
        description: `Generated image for: ${prompt}`,
      })
    } else if (mode === "image-editing") {
      // For image editing, we'll use a simpler approach or different service
      return NextResponse.json(
        { error: "Image editing not yet implemented with free service" }, 
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
