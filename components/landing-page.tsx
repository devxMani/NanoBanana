"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, ImageIcon, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dithering } from "@paper-design/shaders-react"
import Link from "next/link"

export function LandingPage() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden relative">
      {/* Same animated background as the main app */}
      <div className="fixed inset-0 z-0">
        <Dithering
          colorBack="#00000000"
          colorFront="#614B00"
          speed={0.43}
          shape="wave"
          type="4x4"
          pxSize={3}
          scale={1.13}
          style={{
            backgroundColor: "#000000",
            height: "100vh",
            width: "100vw",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full text-center">
          <div className="bg-black/30 backdrop-blur-lg border border-white/10 p-12 rounded-2xl shadow-2xl">
            {/* Hero Section */}
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-white mb-6 font-mono tracking-wider">
                nano banana
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Transform your ideas into stunning visuals with our AI-powered image generation tool. 
                Create from text descriptions or edit existing images with advanced AI technology.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-2xl hover:bg-black/30 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-400/20 rounded-lg mb-4 mx-auto backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Text-to-Image</h3>
                <p className="text-gray-400 text-sm">
                  Generate stunning images from your text descriptions using advanced AI models.
                </p>
              </div>

              <div className="bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-2xl hover:bg-black/30 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-400/20 rounded-lg mb-4 mx-auto backdrop-blur-sm">
                  <ImageIcon className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Image-to-Image</h3>
                <p className="text-gray-400 text-sm">
                  Transform and edit existing images with AI-powered modifications and enhancements.
                </p>
              </div>

              <div className="bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-2xl hover:bg-black/30 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-400/20 rounded-lg mb-4 mx-auto backdrop-blur-sm">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
                <p className="text-gray-400 text-sm">
                  Get results in seconds with our optimized AI pipeline and modern architecture.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/app">
                <Button 
                  size="lg" 
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 text-lg group"
                >
                  Explore 
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 px-8 py-3 text-lg"
              >
                View Demo
              </Button>
            </div>

            {/* Footer text */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-gray-400 text-lg font-light tracking-wide">
                Made by Mani
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}