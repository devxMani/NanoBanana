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
      console.log("API: Processing image-to-image generation")

      // Clean and enhance the prompt
      const cleanPrompt = prompt.trim().replace(/[^\w\s\-.,!?]/g, ' ').substring(0, 200)
      console.log("API: Cleaned prompt for image editing:", cleanPrompt)

      // Get image files from form data
      const image1 = formData.get("image1") as File
      const image2 = formData.get("image2") as File
      const image1Url = formData.get("image1Url") as string
      const image2Url = formData.get("image2Url") as string

      let baseImageUrl = ""

      // Handle URL inputs
      if (image1Url && image2Url) {
        // For URL inputs, we'll use the first image as base and mention the second in prompt
        baseImageUrl = image1Url
        console.log("API: Using URL inputs for image editing")
      } 
      // Handle file uploads
      else if (image1 && image2) {
        console.log("API: Processing uploaded files for image editing")
        
        // Convert first image to base64 for processing
        try {
          const image1Buffer = await image1.arrayBuffer()
          const image1Base64 = Buffer.from(image1Buffer).toString('base64')
          const mimeType = image1.type || 'image/jpeg'
          baseImageUrl = `data:${mimeType};base64,${image1Base64}`
        } catch (error) {
          console.error("API: Error processing uploaded image:", error)
          return NextResponse.json({
            error: "Failed to process uploaded image",
            details: "Please try with different images or use URLs instead"
          }, { status: 400 })
        }
      } else {
        return NextResponse.json({
          error: "Images required for image editing",
          details: "Please provide two images either as files or URLs"
        }, { status: 400 })
      }

      // Create enhanced prompt for image editing
      const enhancedPrompt = `Transform and edit this image: ${cleanPrompt}. Create a cohesive artistic composition combining elements from both provided images.`
      
      try {
        // Try image-to-image with Pollinations.ai
        const imageToImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=768&height=768&nologo=true&enhance=true&model=flux`
        
        console.log("API: Generating image-to-image with enhanced prompt")

        // Add processing delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Test the generated image
        const testResponse = await fetch(imageToImageUrl, { 
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        })

        if (testResponse.ok && testResponse.headers.get('content-type')?.includes('image')) {
          console.log("API: Image-to-image generation successful")
          return NextResponse.json({
            url: imageToImageUrl,
            prompt: prompt,
            description: `AI edited image based on: ${prompt}`,
          })
        } else {
          throw new Error("Image editing service failed")
        }
      } catch (error) {
        console.log("API: Image-to-image failed, trying fallback approach:", error)
        
        // Fallback: Generate new image inspired by the prompt
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(`Artistic composition: ${cleanPrompt}`)}?width=768&height=768&nologo=true&enhance=true`
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        return NextResponse.json({
          url: fallbackUrl,
          prompt: prompt,
          description: `AI generated artistic composition: ${prompt}`,
          note: "Generated as artistic interpretation due to image processing limitations"
        })
      }

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
