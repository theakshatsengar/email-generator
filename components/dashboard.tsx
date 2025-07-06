"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EmailTemplateCard } from "@/components/email-template-card"
import { TemplateSelector, EmailTemplateType } from "@/components/template-selector"
import { Mail, User, Settings, LogOut, Sparkles, Send } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"

interface UserInfo {
  name?: string
  company?: string
  position?: string
  location?: string
  bio?: string
  email?: string
}

interface EmailTemplate {
  id: number
  subject: string
  content: string
  tone: string
}

interface DashboardProps {
  userInfo: UserInfo | null
  onLogout: () => void
  onUpdateInfo: () => void
}

export function Dashboard({ userInfo, onLogout, onUpdateInfo }: DashboardProps) {
  const [prompt, setPrompt] = useState("")
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTone, setSelectedTone] = useState("professional")
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType | null>(null)

  const templatesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (emailTemplates.length > 0 && templatesRef.current) {
      const rect = templatesRef.current.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const offset = 100 // px
      window.scrollTo({
        top: rect.top + scrollTop - offset,
        behavior: "smooth"
      })
    }
  }, [emailTemplates])

  const toneOptions = [
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Friendly" },
    { value: "formal", label: "Formal" },
    { value: "casual", label: "Casual" },
    { value: "appreciative", label: "Appreciative" },
    { value: "collaborative", label: "Collaborative" },
  ]

  const generateEmails = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setEmailTemplates([]) // Clear old templates immediately

    try {
      const response = await fetch("/api/generate-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          tone: selectedTone,
          templateType: selectedTemplate?.id,
          userInfo,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate emails")
      }

      const data = await response.json()
      
      if (data.error) {
        console.error("API Error:", data.error, data.details)
        throw new Error(data.error + (data.details ? `: ${data.details}` : ''))
      }
      
      setEmailTemplates(data.templates || [])
    } catch (error) {
      console.error("Error generating emails:", error)
      // Show error to user instead of fallback templates
      alert(`Failed to generate emails: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setEmailTemplates([])
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <h1 className="text-lg font-medium">EmailCraft</h1>
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem onClick={onUpdateInfo}>
                    <User className="mr-2 h-4 w-4" />
                    Update Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-1">Welcome back, {userInfo?.name || "User"}!</h2>
          <p className="text-sm text-muted-foreground">Generate professional emails with AI assistance</p>
        </div>

        {/* Email Generation Form */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-base font-medium">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Generate Email Templates</span>
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Describe what you want to communicate, and we&apos;ll generate professional email templates for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Template Type</label>
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={setSelectedTemplate}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Tone</label>
                <Select value={selectedTone} onValueChange={setSelectedTone}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Description</label>
              <Textarea
                placeholder="Example: I want to follow up with a potential client about our web development services and schedule a meeting to discuss their project requirements..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] resize-none text-sm"
              />
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={generateEmails}
                disabled={!prompt.trim() || !selectedTemplate || isGenerating}
                className="text-sm"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate Email Templates
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Email Templates */}
        {emailTemplates.length > 0 && (
          <div ref={templatesRef} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Generated Email Templates</h3>
              <Badge variant="secondary" className="text-xs">
                {emailTemplates.length} templates
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {emailTemplates.map((template) => (
                <EmailTemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {emailTemplates.length === 0 && !isGenerating && (
          <div className="text-center py-12">
            <Mail className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-base font-medium mb-2">No emails generated yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter a prompt above to generate your first email templates
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
