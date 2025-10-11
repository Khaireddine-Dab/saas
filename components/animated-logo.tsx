"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface AnimatedLogoProps {
  size?: number
  showText?: boolean
  className?: string
  textClassName?: string
  animationType?: "rotate" | "pulse" | "bounce" | "glow"
}

export function AnimatedLogo({
  size = 32,
  showText = true,
  className = "",
  textClassName = "",
  animationType = "rotate"
}: AnimatedLogoProps) {
  
  const getAnimation = () => {
    switch (animationType) {
      case "rotate":
        return {
          animate: { rotate: 360 },
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }
        }
      case "pulse":
        return {
          animate: { scale: [1, 1.1, 1] },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }
      case "bounce":
        return {
          animate: { y: [0, -5, 0] },
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }
      case "glow":
        return {
          animate: { 
            boxShadow: [
              "0 0 5px rgba(59, 130, 246, 0.5)",
              "0 0 20px rgba(59, 130, 246, 0.8)",
              "0 0 5px rgba(59, 130, 246, 0.5)"
            ]
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }
      default:
        return {}
    }
  }

  return (
    <div className={`flex items-center gap-2 font-bold ${className}`}>
      <motion.div
        className={`rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden`}
        style={{ width: size, height: size }}
        {...getAnimation()}
      >
        <Image
          src="/logo.png"
          alt="talkBridge Logo"
          width={size - 2}
          height={size - 2}
          className="object-contain"
        />
      </motion.div>
      {showText && (
        <motion.span 
          className={textClassName}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
        >
          <motion.span
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_100%] bg-clip-text text-transparent"
          >
            talkBridge
          </motion.span>
        </motion.span>
      )}
    </div>
  )
}
