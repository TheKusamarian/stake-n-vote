import React from "react"

interface StepsProps {
  activeStep: number
  children: React.ReactNode
  className?: string
}

interface StepProps {
  title: string
  stepNumber?: number
  isActive?: boolean
  isCompleted?: boolean
}

export function Steps({ activeStep, children, className }: StepsProps) {
  const stepsArray = React.Children.toArray(
    children
  ) as React.ReactElement<StepProps>[]
  return (
    <div className={`flex items-center ${className ? className : ""}`}>
      {stepsArray.map((child, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === activeStep
        const isCompleted = stepNumber < activeStep

        return (
          <div key={`step-${index}`} className="flex items-center">
            {React.cloneElement(child, {
              stepNumber,
              isActive,
              isCompleted,
            })}
            {index !== stepsArray.length - 1 && (
              <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function Step({ title, stepNumber, isActive, isCompleted }: StepProps) {
  return (
    <div className="flex items-center">
      <div
        className={`rounded-full w-8 h-8 flex items-center justify-center text-white ${
          isCompleted
            ? "bg-green-500"
            : isActive
            ? "bg-blue-500"
            : "bg-gray-300"
        }`}
      >
        {stepNumber}
      </div>
      <span className={`ml-2 text-sm ${isActive ? "font-bold" : ""}`}>
        {title}
      </span>
    </div>
  )
}
