"use client"

import { ArrowRight, Wallet, User, Settings, Briefcase } from "lucide-react"

export default function FlowDiagram() {
  const steps = [
    {
      icon: Wallet,
      title: "Connect Wallet",
      description: "Connect your SUI wallet",
      status: "completed",
    },
    {
      icon: User,
      title: "Choose Role",
      description: "Select Client, Freelancer, or Creator",
      status: "current",
    },
    {
      icon: Settings,
      title: "Setup Profile",
      description: "Add your information and skills",
      status: "upcoming",
    },
    {
      icon: Briefcase,
      title: "Start Working",
      description: "Access your personalized dashboard",
      status: "upcoming",
    },
  ]

  return (
    <div className="bg-gray-900/30 rounded-lg p-6 mb-8">
      <h3 className="text-cyan-400 font-semibold mb-4 text-center">Your Journey</h3>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  step.status === "completed"
                    ? "bg-green-500"
                    : step.status === "current"
                      ? "bg-cyan-500"
                      : "bg-gray-600"
                }`}
              >
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-cyan-100">{step.title}</div>
                <div className="text-xs text-cyan-100/60">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && <ArrowRight className="text-cyan-400 mx-4" size={20} />}
          </div>
        ))}
      </div>
    </div>
  )
}
