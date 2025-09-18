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
      console.log("API: Generating image with multiple fallback services")

      // Clean and enhance the prompt
      const cleanPrompt = prompt.trim().replace(/[^\w\s\-.,!?]/g, ' ').substring(0, 200)
      console.log("API: Cleaned prompt:", cleanPrompt)

      // Try multiple services for better reliability
      const services = [
        {
          name: "Pollinations.ai",
          url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=768&height=768&nologo=true&enhance=true&model=flux`
        },
        {
          name: "Pollinations.ai (backup)",
          url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=512&height=512&nologo=true`
        },
        {
          name: "Image.ai (simple)",
          url: `https://api.deepai.org/api/text2img`
        }
      ]

      // Try the primary service first
      try {
        const primaryUrl = services[0].url
        console.log("API: Trying primary service:", primaryUrl)

        // Add a small delay to ensure image generation
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Test if the image URL works
        const testResponse = await fetch(primaryUrl, { 
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        })

        if (testResponse.ok && testResponse.headers.get('content-type')?.includes('image')) {
          console.log("API: Primary service successful")
          return NextResponse.json({
            url: primaryUrl,
            prompt: prompt,
            description: `AI generated image: ${prompt}`,
          })
        } else {
          throw new Error(`Primary service failed: ${testResponse.status}`)
        }
      } catch (primaryError) {
        console.log("API: Primary service failed, trying backup:", primaryError)
        
        // Try backup service
        try {
          const backupUrl = services[1].url
          console.log("API: Trying backup service:", backupUrl)

          await new Promise(resolve => setTimeout(resolve, 500))

          const backupResponse = await fetch(backupUrl, { 
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          })

          if (backupResponse.ok) {
            console.log("API: Backup service successful")
            return NextResponse.json({
              url: backupUrl,
              prompt: prompt,
              description: `AI generated image: ${prompt}`,
            })
          }
        } catch (backupError) {
          console.log("API: Backup service also failed:", backupError)
        }
      }

      // If all services fail, return a placeholder with useful message
      console.log("API: All services failed, returning helpful error")
      return NextResponse.json({
        error: "Image generation temporarily unavailable",
        details: "Please try again in a moment. You can also try a simpler prompt.",
        suggestion: "Try prompts like: 'a cat', 'sunset', 'mountain landscape'"
      }, { status: 503 })

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
    console.error("API: Unexpected error:", error)
    
    return NextResponse.json(
      {
        error: "Service temporarily unavailable",
        details: "Please try again in a moment",
        suggestions: [
          "Try a simpler prompt",
          "Check your internet connection", 
          "Refresh the page and try again"
        ]
      },
      { status: 500 },
    )
  }
}
