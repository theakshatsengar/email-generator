"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Briefcase } from "lucide-react"
import { PDF_PARSER_URL } from "@/config/microservice"

function extractInfoFromResume(text: string) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let name = "";
  let email = "";
  let phone = "";
  let linkedin = "";
  let website = "";
  let location = "";

  // Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) email = emailMatch[0];

  // Phone (simple international/US formats)
  const phoneMatch = text.match(/(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) phone = phoneMatch[0];

  // LinkedIn
  const linkedinMatch = text.match(/https?:\/\/(www\.)?linkedin\.com\/[a-zA-Z0-9\-_/]+/);
  if (linkedinMatch) linkedin = linkedinMatch[0];

  // Website (first non-LinkedIn http(s) link)
  const websiteMatch = text.match(/https?:\/\/(?!www\.linkedin\.com)[a-zA-Z0-9./?=_-]+/);
  if (websiteMatch) website = websiteMatch[0];

  // Name: first non-empty line that isn't email/phone/link
  for (const line of lines) {
    if (
      line &&
      !line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) &&
      !line.match(/(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/) &&
      !line.match(/https?:\/\//)
    ) {
      name = line;
      break;
    }
  }

  // Location: look for a line with a city/state/country (very basic)
  for (const line of lines) {
    if (line.match(/\b([A-Z][a-z]+,?\s?)+([A-Z]{2,})?\b/)) {
      location = line;
      break;
    }
  }

  return { name, email, phone, linkedin, website, location };
}

interface PersonalInfoModalProps {
  initialInfo: any
  onSave: (info: any) => void
  onClose: () => void
}

export function PersonalInfoModal({ initialInfo, onSave, onClose }: PersonalInfoModalProps) {
  const [formData, setFormData] = useState({
    name: initialInfo?.name || "",
    email: initialInfo?.email || "",
    phone: initialInfo?.phone || "",
    company: initialInfo?.company || "",
    position: initialInfo?.position || "",
    location: initialInfo?.location || "",
    bio: initialInfo?.bio || "",
    website: initialInfo?.website || "",
    linkedin: initialInfo?.linkedin || "",
    ...initialInfo,
  })
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  // NEW: Upload to Python microservice and parse
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFileName(file.name);
    setResumeLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch(`${PDF_PARSER_URL}/parse-resume`, {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // The microservice returns structured data directly
      setFormData((prev: any) => ({
        ...prev,
        name: prev.name || data.name || "",
        email: prev.email || data.email || "",
        phone: prev.phone || data.phone || "",
        location: prev.location || data.location || "",
        company: prev.company || data.company || "",
        position: prev.position || data.position || "",
        title: prev.title || data.title || "",
        bio: prev.bio || data.bio || "",
        website: prev.website || data.website || "",
        linkedin: prev.linkedin || data.linkedin || "",
      }));
      
      // Show success message
      setResumeText("✅ Resume parsed successfully! Your information has been auto-filled.");
      
    } catch (err: any) {
      setResumeText("❌ Failed to parse PDF: " + (err?.message || err?.toString() || "Unknown error"));
    } finally {
      setResumeLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-base font-medium">
            <User className="h-4 w-4" />
            <span>Personal Information</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            This information will be used to personalize your email templates. You can update this anytime.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resume Upload - moved to top */}
          <div className="space-y-2">
            <Label htmlFor="resume" className="text-sm font-medium">Upload Resume (PDF)</Label>
            <Input id="resume" type="file" accept="application/pdf" onChange={handleResumeUpload} className="text-sm" />
            {resumeFileName && <div className="text-xs text-muted-foreground">{resumeFileName}</div>}
            {resumeLoading && <div className="text-xs text-primary">Parsing resume...</div>}
            {resumeText && (
              <Textarea
                value={resumeText}
                readOnly
                className="min-h-[100px] text-xs bg-muted/50"
                placeholder="Extracted resume text will appear here."
              />
            )}
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Basic Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="John Doe"
                  className="text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="john@example.com"
                  className="text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm">
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="New York, NY"
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span>Professional Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm">
                  Company
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  placeholder="Acme Corp"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-sm">
                  Position/Title
                </Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                  placeholder="Software Engineer"
                  className="text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm">
                Professional Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Brief description of your professional background and expertise..."
                className="min-h-[80px] resize-none text-sm"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Social & Web Presence</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm">
                  Website
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm">
                  LinkedIn Profile
                </Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" className="flex-1 text-sm">
              Save Information
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 text-sm bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
