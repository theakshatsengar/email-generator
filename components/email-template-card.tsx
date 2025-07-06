"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check, Edit3, Send } from "lucide-react"

interface EmailTemplateCardProps {
  template: {
    id: number
    subject: string
    content: string
    tone: string
    size?: string
  }
}

export function EmailTemplateCard({ template }: EmailTemplateCardProps) {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(template.content)
  const [editedSubject, setEditedSubject] = useState(template.subject)

  const handleCopy = async () => {
    const textToCopy = `Subject: ${editedSubject}\n\n${editedContent}`

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = textToCopy
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSaveEdit = () => {
    setIsEditing(false)
  }

  const handleSend = () => {
    // Encode the subject and body for URL parameters
    const encodedSubject = encodeURIComponent(editedSubject)
    const encodedBody = encodeURIComponent(editedContent)
    
    // Open Gmail compose window with pre-filled subject and body
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodedSubject}&body=${encodedBody}`
    window.open(gmailUrl, '_blank')
  }

  const getToneColor = (tone: string) => {
    switch (tone.toLowerCase()) {
      case "professional":
        return "bg-primary/10 text-primary border-primary/20"
      case "friendly":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
      case "formal":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      case "casual":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
      case "appreciative":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
      case "collaborative":
        return "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20"
      case "enthusiastic":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
      case "confident":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
      case "empathetic":
        return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20"
      case "persuasive":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground border-muted"
    }
  }

  const getSizeColor = (size: string) => {
    switch (size?.toLowerCase()) {
      case "concise":
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20"
      case "brief":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      case "standard":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
      case "detailed":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
      case "comprehensive":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
      default:
        return "bg-muted text-muted-foreground border-muted"
    }
  }

  return (
    <Card className="h-full hover:shadow-md transition-shadow flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editedSubject}
                onChange={(e) => setEditedSubject(e.target.value)}
                className="w-full text-sm font-medium bg-transparent border-b border-border focus:border-primary focus:outline-none pb-1"
                placeholder="Enter email subject"
                title="Email subject"
              />
            ) : (
              <CardTitle className="text-sm font-medium leading-tight line-clamp-2">{editedSubject}</CardTitle>
            )}
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            {template.size && (
              <Badge className={`text-xs ${getSizeColor(template.size)} border`}>
                {template.size}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4 flex-1 flex flex-col">
        <div className="flex-1">
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[200px] text-xs resize-none h-full"
            />
          ) : (
            <div className="text-xs text-muted-foreground leading-relaxed h-full overflow-hidden space-y-1">
              {editedContent.split('\n').map((line, index) => {
                const trimmedLine = line.trim()
                if (trimmedLine === '') {
                  return <div key={index} className="h-2" />
                }
                return (
                  <div key={index} className="whitespace-pre-wrap">
                    {line}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSaveEdit} className="flex-1 text-xs h-8">
                Save Changes
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setEditedContent(template.content)
                  setEditedSubject(template.subject)
                }}
                className="flex-1 text-xs h-8"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" onClick={handleSend} className="flex-1 text-xs h-8">
                <Send className="mr-1 h-3 w-3" />
                Send
              </Button>
              <Button size="sm" variant="outline" onClick={handleCopy} disabled={copied} className="flex-1 text-xs h-8">
                {copied ? (
                  <>
                    <Check className="mr-1 h-3 w-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3 w-3" />
                    Copy
                  </>
                )}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="text-xs h-8">
                <Edit3 className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
