"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Mail, Users, Handshake, Heart, MessageSquare, Plus, Sparkles, Calendar, Star } from "lucide-react"

export interface EmailTemplateType {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  useCase: string
  example: string
  color: string
}

const emailTemplates: EmailTemplateType[] = [
  {
    id: "job-application",
    name: "Job Application",
    description: "Professional job application and outreach emails",
    icon: <Mail className="h-5 w-5" />,
    category: "Career",
    useCase: "Applying for jobs, reaching out to hiring managers",
    example: "Hi [Name], I'm excited to apply for the [Position] role...",
    color: "bg-blue-500"
  },
  {
    id: "cold-outreach",
    name: "Cold Outreach",
    description: "Professional networking and business development",
    icon: <Users className="h-5 w-5" />,
    category: "Networking",
    useCase: "Reaching out to potential clients or partners",
    example: "Hi [Name], I came across your work and wanted to connect...",
    color: "bg-green-500"
  },
  {
    id: "follow-up",
    name: "Follow-up",
    description: "Post-meeting or post-interview follow-ups",
    icon: <MessageSquare className="h-5 w-5" />,
    category: "Follow-up",
    useCase: "Following up after meetings or interviews",
    example: "Hi [Name], Thank you for taking the time to meet...",
    color: "bg-purple-500"
  },
  {
    id: "thank-you",
    name: "Thank You",
    description: "Gratitude and appreciation emails",
    icon: <Heart className="h-5 w-5" />,
    category: "Gratitude",
    useCase: "Thanking someone for their time or help",
    example: "Dear [Name], I wanted to express my gratitude...",
    color: "bg-pink-500"
  },
  {
    id: "introduction-request",
    name: "Introduction Request",
    description: "Asking for referrals or introductions",
    icon: <Users className="h-5 w-5" />,
    category: "Networking",
    useCase: "Requesting introductions to professionals",
    example: "Hi [Name], I hope this email finds you well...",
    color: "bg-indigo-500"
  },
  {
    id: "partnership",
    name: "Partnership",
    description: "Business partnership proposals",
    icon: <Handshake className="h-5 w-5" />,
    category: "Business",
    useCase: "Proposing partnerships or collaborations",
    example: "Hi [Name], I believe there's an opportunity...",
    color: "bg-orange-500"
  },
  {
    id: "sales-pitch",
    name: "Sales Pitch",
    description: "Product or service sales emails",
    icon: <Mail className="h-5 w-5" />,
    category: "Sales",
    useCase: "Pitching products or services to prospects",
    example: "Hi [Name], I think [Product] could help you...",
    color: "bg-red-500"
  },
  {
    id: "client-update",
    name: "Client Update",
    description: "Keeping clients informed about progress",
    icon: <MessageSquare className="h-5 w-5" />,
    category: "Client",
    useCase: "Updating clients on project progress",
    example: "Hi [Name], I wanted to update you on...",
    color: "bg-teal-500"
  },
  {
    id: "meeting-request",
    name: "Meeting Request",
    description: "Scheduling meetings or calls",
    icon: <Calendar className="h-5 w-5" />,
    category: "Scheduling",
    useCase: "Requesting meetings or scheduling calls",
    example: "Hi [Name], I'd love to schedule a meeting...",
    color: "bg-cyan-500"
  },
  {
    id: "feedback-request",
    name: "Feedback Request",
    description: "Asking for feedback or reviews",
    icon: <Star className="h-5 w-5" />,
    category: "Feedback",
    useCase: "Requesting feedback or testimonials",
    example: "Hi [Name], I hope you're satisfied with...",
    color: "bg-yellow-500"
  },
  {
    id: "custom",
    name: "Custom Template",
    description: "Create your own personalized template",
    icon: <Plus className="h-5 w-5" />,
    category: "Custom",
    useCase: "For any specific email purpose",
    example: "Create your own template structure...",
    color: "bg-gray-500"
  }
]

interface TemplateSelectorProps {
  selectedTemplate: EmailTemplateType | null
  onTemplateSelect: (template: EmailTemplateType) => void
  trigger?: React.ReactNode
}

export function TemplateSelector({ selectedTemplate, onTemplateSelect, trigger }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleTemplateSelect = (template: EmailTemplateType) => {
    onTemplateSelect(template)
    setIsOpen(false)
  }

  const categories = Array.from(new Set(emailTemplates.map(t => t.category)))

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full justify-start">
            <Sparkles className="mr-2 h-4 w-4" />
            {selectedTemplate ? selectedTemplate.name : "Select Email Template"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Choose Email Template</span>
          </DialogTitle>
          <DialogDescription>
            Select the type of email you want to generate.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {category}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {emailTemplates
                  .filter(template => template.category === category)
                  .map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all hover:shadow-md p-3 ${
                        selectedTemplate?.id === template.id
                          ? "ring-2 ring-primary"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded-md ${template.color} text-white`}>
                          {template.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{template.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{template.description}</p>
                        </div>
                        {selectedTemplate?.id === template.id && (
                          <Badge variant="secondary" className="text-xs shrink-0">
                            ✓
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 