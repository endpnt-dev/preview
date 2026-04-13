'use client'

import { Check, Star } from 'lucide-react'

interface PricingPlan {
  id: string
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
  ctaAction?: () => void
}

interface PricingTableProps {
  plans: PricingPlan[]
  className?: string
}

export default function PricingTable({ plans, className = '' }: PricingTableProps) {
  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`relative bg-gray-800 rounded-xl p-6 border transition-all duration-200 hover:scale-105 ${
            plan.highlighted
              ? 'border-teal-400 shadow-lg shadow-teal-400/20'
              : 'border-gray-700 hover:border-gray-600'
          }`}
        >
          {/* Popular badge */}
          {plan.highlighted && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Star className="h-3 w-3" />
                Most Popular
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-100 mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className={`text-4xl font-bold ${plan.highlighted ? 'text-teal-400' : 'text-gray-100'}`}>
                {plan.price}
              </span>
              {plan.period && plan.price !== 'Custom' && (
                <span className="text-gray-400 ml-1">/{plan.period}</span>
              )}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{plan.description}</p>
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm">
                <Check className={`h-4 w-4 mr-3 mt-0.5 flex-shrink-0 ${
                  plan.highlighted ? 'text-teal-400' : 'text-green-400'
                }`} />
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <button
            onClick={plan.ctaAction}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              plan.highlighted
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-100'
            }`}
          >
            {plan.cta}
          </button>
        </div>
      ))}
    </div>
  )
}